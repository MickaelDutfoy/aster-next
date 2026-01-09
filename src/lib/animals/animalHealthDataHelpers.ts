import { AnimalHealthAct, AnimalHealthActType } from '../types';

export const getLastAct = (acts: AnimalHealthAct[] | undefined, type: AnimalHealthActType) =>
  acts?.find((a) => a.type === type) ?? null;

export const getLastActDate = (acts: AnimalHealthAct[] | undefined, type: AnimalHealthActType) =>
  getLastAct(acts, type)?.date ?? null;

export const getLastActIsFirst = (acts: AnimalHealthAct[] | undefined, type: AnimalHealthActType) =>
  getLastAct(acts, type)?.isFirst ?? false;
