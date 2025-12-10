export const parseFamilyData = (formData: FormData) => {
  const familyForm = {
    contactFullName: formData.get('contactFullName')?.toString().trim(),
    address: formData.get('address')?.toString().trim(),
    zip: formData.get('zip')?.toString().trim(),
    city: formData.get('city')?.toString().trim(),
    email: formData.get('email')?.toString().trim(),
    phoneNumber: formData.get('phoneNumber')?.toString().trim(),
    hasChildren: formData.has('hasChildren'),
    otherAnimals: formData.get('otherAnimals')?.toString().trim(),
  };

  if (!familyForm.contactFullName || !familyForm.address || !familyForm.zip || !familyForm.city) {
    return undefined;
  }

  const family = {
    contactFullName: familyForm.contactFullName,
    email: familyForm.email,
    phoneNumber: familyForm.phoneNumber,
    address: familyForm.address,
    zip: familyForm.zip,
    city: familyForm.city,
    hasChildren: familyForm.hasChildren,
    otherAnimals: familyForm.otherAnimals,
  };

  return family;
};
