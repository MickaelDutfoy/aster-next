export const getAge = (birthDate: Date): string => {
    const birth = new Date(birthDate);
    const now = new Date();

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    if (years < 1) {
        if (months === 0 && days === 0) return "moins d’un jour";
        if (months === 0) return `${days} jour${days > 1 ? "s" : ""}`;
        if (days === 0) return `${months} mois`;
        return `${months} mois ${days} jour${days > 1 ? "s" : ""}`;
    }

    if (months === 0) return `${years} an${years > 1 ? "s" : ""}`;
    return `${years} an${years > 1 ? "s" : ""} ${months} mois`;
};