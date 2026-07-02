import type { Animal, AnimalHealthAct, AnimalTestEntry, AnimalWeightEntry } from '@/lib/types';
import { AnimalHealthActType, AnimalStatus } from '@prisma/client';
import { Document, Image, Page, StyleSheet, Text, View, renderToBuffer } from '@react-pdf/renderer';
import path from 'node:path';

type TranslateFn = (key: string, values?: Record<string, string | number>) => string;

type BuildAnimalPdfParams = {
  animal: Animal;
  locale: string;
  t: TranslateFn;
};

const COMMON_SPECIES = ['cat', 'dog', 'ferret', 'rabbit'];
const ASTER_LOGO_PATH = path.join(process.cwd(), 'public', 'icons', 'aster-icon-192.png');
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const colors = {
  text: '#16110e', // smoky-black
  muted: '#363c38', // outer-space
  title: '#653d24', // brown-bark
  titleBg: '#ece5df', // isabelline
  border: '#a6988c', // cinereous
  lightBorder: '#d3d1cf', // stone
};

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    color: colors.text,
    lineHeight: 1.35,
  },

  header: {
    marginBottom: 18,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    borderBottomStyle: 'solid',
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  brandBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  brandTextAndLink: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  brandText: {
    fontWeight: 700,
    paddingTop: 3,
    fontSize: 9,
    color: colors.muted,
  },

  brandLink: {
    fontWeight: 700,
    textDecoration: 'underline',
    paddingTop: 3,
    fontSize: 9,
    color: colors.muted,
  },

  brandLogo: {
    width: 28,
    height: 28,
  },

  brand: {
    fontSize: 9,
    color: colors.muted,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 18,
  },

  subtitle: {
    fontSize: 11,
    color: colors.muted,
  },

  badgeRow: {
    flexDirection: 'row',
    marginTop: 8,
  },

  badge: {
    paddingTop: 5,
    paddingBottom: 3,
    paddingLeft: 8,
    paddingRight: 8,
    marginRight: 6,
    borderRadius: 999,
    backgroundColor: colors.titleBg,
    color: colors.title,
    fontSize: 9,
  },

  section: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'solid',
    borderRadius: 8,
  },

  sectionTitle: {
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: colors.titleBg,
    color: colors.title,
    fontSize: 12,
    fontWeight: 'bold',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  sectionBody: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
  },

  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },

  label: {
    width: 200,
    color: colors.muted,
    fontWeight: 'bold',
  },

  value: {
    flex: 1,
  },

  paragraph: {
    marginBottom: 5,
  },

  longText: {
    paddingTop: 4,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: colors.lightBorder,
    borderLeftStyle: 'solid',
  },

  subSection: {
    marginBottom: 9,
  },

  subTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.title,
    marginBottom: 3,
  },

  historic: {
    marginTop: 4,
    paddingLeft: 10,
    fontSize: 9,
    color: colors.muted,
  },

  bulletRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },

  bullet: {
    marginLeft: 5,
    width: 10,
  },

  bulletText: {
    flex: 1,
  },

  table: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'solid',
    borderRadius: 5,
  },

  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.lightBorder,
    borderTopStyle: 'solid',
  },

  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: colors.titleBg,
  },

  tableCell: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 6,
    paddingRight: 6,
    fontSize: 9,
  },

  tableHeaderCell: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 6,
    paddingRight: 6,
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.title,
  },

  footer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderTopStyle: 'solid',
    fontSize: 8,
    color: colors.muted,
    textAlign: 'right',
  },
});

const formatDate = (date: Date, locale: string): string => {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

const formatSpecies = (species: string, t: TranslateFn): string => {
  return COMMON_SPECIES.includes(species) ? t(`animals.species.${species}`) : species;
};

const formatWeight = (weightGrams: number, locale: string): string => {
  return `${(weightGrams / 1000).toLocaleString(locale, {
    minimumFractionDigits: weightGrams % 1000 === 0 ? 0 : 2,
    maximumFractionDigits: 3,
  })} kg`;
};

const formatSignedGrams = (grams: number): string => {
  if (grams > 0) return `+${grams} g`;
  return `${grams} g`;
};

const getWeightEvolution = (
  entries: AnimalWeightEntry[],
  index: number,
  t: TranslateFn,
): string => {
  const currentEntry = entries[index];
  const previousEntry = entries[index + 1];

  if (!currentEntry || !previousEntry) {
    return '—';
  }

  const grams = currentEntry.weightGrams - previousEntry.weightGrams;
  const days = Math.round(
    (currentEntry.date.getTime() - previousEntry.date.getTime()) / MS_PER_DAY,
  );

  return t('animals.weightEvolution', {
    grams: formatSignedGrams(grams),
    days: Math.max(days, 0),
  });
};

const filterHealthActs = (
  acts: AnimalHealthAct[] | undefined,
  type: AnimalHealthActType,
): AnimalHealthAct[] => {
  return acts?.filter((act) => act.type === type) ?? [];
};

const hasAdoptionData = (animal: Animal): boolean => {
  const adoption = animal.adoption;

  if (!adoption) return false;

  return Boolean(
    adoption.adopterFullName ||
      adoption.adopterEmail ||
      adoption.adopterPhoneNumber ||
      adoption.adopterAddress ||
      adoption.adopterZip ||
      adoption.adopterCity ||
      adoption.homeVisitDone ||
      adoption.neuteringPlannedAt ||
      adoption.adoptionContractSignedAt ||
      adoption.adoptionFeePaid ||
      adoption.legalTransferAt ||
      adoption.information,
  );
};

const ValueRow = ({ label, value }: { label: string; value: string | null | undefined }) => {
  if (!value) return null;

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const BulletItem = ({ children }: { children: string }) => {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
};

const HealthActBlock = ({
  title,
  historyTitle,
  acts,
  firstLabel,
  locale,
}: {
  title: string;
  historyTitle: string;
  acts: AnimalHealthAct[];
  firstLabel: string;
  locale: string;
}) => {
  if (acts.length === 0) return null;

  const [lastAct, ...history] = acts;

  return (
    <View style={styles.subSection} wrap={false}>
      <View style={styles.row}>
        <Text style={styles.label}>{title}</Text>
        <Text style={styles.value}>
          {formatDate(lastAct.date, locale)}
          {lastAct.isFirst ? firstLabel : ''}
        </Text>
      </View>

      {history.length > 0 && (
        <View style={styles.historic}>
          <Text style={styles.paragraph}>{historyTitle}</Text>
          {history.map((act, index) => (
            <BulletItem key={act.id ?? index}>
              {`${formatDate(act.date, locale)}${act.isFirst ? firstLabel : ''}`}
            </BulletItem>
          ))}
        </View>
      )}
    </View>
  );
};

const GeneralSection = ({
  animal,
  locale,
  t,
}: {
  animal: Animal;
  locale: string;
  t: TranslateFn;
}) => {
  return (
    <View style={styles.section} wrap={false}>
      <Text style={styles.sectionTitle}>{t('animals.tabs.general')}</Text>

      <View style={styles.sectionBody}>
        <ValueRow label={t('animals.colorLabel')} value={animal.color} />

        {animal.birthDate && (
          <ValueRow
            label={t('animals.fields.birthDateLabel')}
            value={
              animal.status === AnimalStatus.DECEASED
                ? `${formatDate(animal.birthDate, locale)} — ${t('animals.status.DECEASED')}`
                : formatDate(animal.birthDate, locale)
            }
          />
        )}

        <ValueRow
          label={t('animals.fields.neuteredStatus')}
          value={animal.isNeutered ? t('animals.neuteredSuffix') : t('animals.notNeuteredSuffix')}
        />

        <ValueRow label={t('animals.detailedLegalIdLabel')} value={animal.legalId} />
        <ValueRow label={t('animals.findLocationLabel')} value={animal.findLocation} />

        {animal.information && (
          <View style={styles.subSection}>
            <Text style={styles.subTitle}>{t('animals.additionalInfoLabel')}</Text>
            <Text style={styles.longText}>{animal.information}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const SituationSection = ({
  animal,
  locale,
  t,
}: {
  animal: Animal;
  locale: string;
  t: TranslateFn;
}) => {
  return (
    <View style={styles.section} wrap={false}>
      <Text style={styles.sectionTitle}>{t('animals.currentStatus')}</Text>

      <View style={styles.sectionBody}>
        <ValueRow
          label={t('animals.fields.statusUnrequiredLabel')}
          value={t(`animals.status.${animal.status}`)}
        />

        {animal.trialDateStart && (
          <ValueRow
            label={t('animals.trialPeriodLabel')}
            value={formatDate(animal.trialDateStart, locale)}
          />
        )}

        {animal.quarantineDateStart && (
          <ValueRow
            label={t('animals.quarantinePeriodLabel')}
            value={formatDate(animal.quarantineDateStart, locale)}
          />
        )}
      </View>
    </View>
  );
};

const HealthSection = ({
  animal,
  locale,
  t,
}: {
  animal: Animal;
  locale: string;
  t: TranslateFn;
}) => {
  const vaccinations = filterHealthActs(animal.healthActs, AnimalHealthActType.VACCINATION);
  const dewormings = filterHealthActs(animal.healthActs, AnimalHealthActType.DEWORM);
  const fleaTreatments = filterHealthActs(animal.healthActs, AnimalHealthActType.ANTIFLEA);

  const weightEntries = animal.weightEntries ?? [];
  const testEntries = animal.testEntries ?? [];

  const hasHealthInfo =
    vaccinations.length > 0 ||
    dewormings.length > 0 ||
    fleaTreatments.length > 0 ||
    weightEntries.length > 0 ||
    testEntries.length > 0 ||
    Boolean(animal.healthInformation);

  if (!hasHealthInfo) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t('animals.tabs.health')}</Text>

      <View style={styles.sectionBody}>
        <HealthActBlock
          title={t('animals.lastVaxLabel')}
          historyTitle={t('animals.vaxHistoryLabel')}
          acts={vaccinations}
          firstLabel={t('animals.primoShort')}
          locale={locale}
        />

        <HealthActBlock
          title={t('animals.lastDewormLabel')}
          historyTitle={t('animals.dewormHistoryLabel')}
          acts={dewormings}
          firstLabel={t('animals.firstDewormShort')}
          locale={locale}
        />

        <HealthActBlock
          title={t('animals.lastFleaTreatmentLabel')}
          historyTitle={t('animals.antifleaHistoryLabel')}
          acts={fleaTreatments}
          firstLabel={t('animals.firstDewormShort')}
          locale={locale}
        />

        {weightEntries.length > 0 && (
          <View style={styles.subSection}>
            <Text style={styles.subTitle}>{t('animals.weightEntriesTitle')}</Text>

            <View style={styles.table}>
              <View style={styles.tableHeaderRow}>
                <Text style={styles.tableHeaderCell}>{t('common.date')}</Text>
                <Text style={styles.tableHeaderCell}>{t('animals.weight')}</Text>
                <Text style={styles.tableHeaderCell}>{t('animals.weightEvolutionTitle')}</Text>
              </View>

              {weightEntries.map((entry, index) => (
                <View style={styles.tableRow} key={entry.id ?? index}>
                  <Text style={styles.tableCell}>{formatDate(entry.date, locale)}</Text>
                  <Text style={styles.tableCell}>{formatWeight(entry.weightGrams, locale)}</Text>
                  <Text style={styles.tableCell}>
                    {getWeightEvolution(weightEntries, index, t)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {testEntries.length > 0 && (
          <View style={styles.subSection}>
            <Text style={styles.subTitle}>{t('animals.testEntriesSheetTitle')}</Text>

            {testEntries.map((test: AnimalTestEntry, index) => (
              <BulletItem key={test.id ?? index}>
                {`${test.testName} (${t(`animals.testResults.${test.result}`)}) — ${formatDate(
                  test.date,
                  locale,
                )}`}
              </BulletItem>
            ))}
          </View>
        )}

        {animal.healthInformation && (
          <View style={styles.subSection}>
            <Text style={styles.subTitle}>{t('animals.healthNotes')}</Text>
            <Text style={styles.longText}>{animal.healthInformation}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const AdoptionSection = ({
  animal,
  locale,
  t,
}: {
  animal: Animal;
  locale: string;
  t: TranslateFn;
}) => {
  const adoption = animal.adoption;

  if (!adoption || !hasAdoptionData(animal)) return null;

  return (
    <View style={styles.section} wrap={false}>
      <Text style={styles.sectionTitle}>{t('animals.tabs.adoption')}</Text>

      <View style={styles.sectionBody}>
        {(adoption.adopterFullName ||
          adoption.adopterAddress ||
          adoption.adopterZip ||
          adoption.adopterCity ||
          adoption.adopterEmail ||
          adoption.adopterPhoneNumber) && (
          <View style={styles.subSection}>
            <Text style={styles.subTitle}>{t('animals.adopterLabel')}</Text>

            {adoption.adopterFullName && (
              <Text style={styles.paragraph}>{adoption.adopterFullName}</Text>
            )}

            {adoption.adopterAddress && (
              <Text style={styles.paragraph}>{adoption.adopterAddress}</Text>
            )}

            {(adoption.adopterZip || adoption.adopterCity) && (
              <Text style={styles.paragraph}>
                {[adoption.adopterZip, adoption.adopterCity].filter(Boolean).join(' ')}
              </Text>
            )}

            {adoption.adopterEmail && <Text style={styles.paragraph}>{adoption.adopterEmail}</Text>}

            {adoption.adopterPhoneNumber && (
              <Text style={styles.paragraph}>{adoption.adopterPhoneNumber}</Text>
            )}
          </View>
        )}

        {(adoption.homeVisitDone ||
          adoption.neuteringPlannedAt ||
          adoption.adoptionContractSignedAt ||
          adoption.adoptionFeePaid ||
          adoption.legalTransferAt) && (
          <View style={styles.subSection}>
            <Text style={styles.subTitle}>{t('animals.aboutAdoption')}</Text>

            {adoption.homeVisitDone && <BulletItem>{t('animals.homeVisitDone')}</BulletItem>}

            {adoption.neuteringPlannedAt && (
              <BulletItem>
                {`${t('animals.neuteringPlannedLabel')}${formatDate(adoption.neuteringPlannedAt, locale)}`}
              </BulletItem>
            )}

            {adoption.adoptionContractSignedAt && (
              <BulletItem>
                {`${t('animals.contractSignedLabel')}${formatDate(
                  adoption.adoptionContractSignedAt,
                  locale,
                )}`}
              </BulletItem>
            )}

            {adoption.adoptionFeePaid && <BulletItem>{t('animals.feesPaid')}</BulletItem>}

            {adoption.legalTransferAt && (
              <BulletItem>
                {`${t('animals.legalTransferLabel')}${formatDate(adoption.legalTransferAt, locale)}`}
              </BulletItem>
            )}
          </View>
        )}

        {adoption.information && (
          <View style={styles.subSection}>
            <Text style={styles.subTitle}>{t('animals.adoptionNotes')}</Text>
            <Text style={styles.longText}>{adoption.information}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const AnimalPdfDocument = ({ animal, locale, t }: BuildAnimalPdfParams) => {
  const species = formatSpecies(animal.species, t);
  const sex = t(`animals.sex.${animal.sex}`);
  const status = t(`animals.status.${animal.status}`);

  return (
    <Document title={`Aster - ${animal.name}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header} wrap={false}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>{animal.name}</Text>

            <View style={styles.brandBox}>
              <View style={styles.brandTextAndLink}>
                <Text style={styles.brandText}>{t('publish.page.poweredByAster')}</Text>
                <Text style={styles.brandLink}>aster-app.eu</Text>
              </View>
              <Image style={styles.brandLogo} src={ASTER_LOGO_PATH} />
            </View>
          </View>

          <View style={styles.badgeRow}>
            <Text style={styles.badge}>{species}</Text>
            <Text style={styles.badge}>{sex}</Text>
            <Text style={styles.badge}>{status}</Text>
          </View>
        </View>

        <GeneralSection animal={animal} locale={locale} t={t} />
        <HealthSection animal={animal} locale={locale} t={t} />
        <SituationSection animal={animal} locale={locale} t={t} />
        <AdoptionSection animal={animal} locale={locale} t={t} />

        <Text style={styles.footer}></Text>
      </Page>
    </Document>
  );
};

export const buildAnimalPdf = async ({
  animal,
  locale,
  t,
}: BuildAnimalPdfParams): Promise<Buffer> => {
  return renderToBuffer(<AnimalPdfDocument animal={animal} locale={locale} t={t} />);
};
