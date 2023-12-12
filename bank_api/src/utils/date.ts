export function compareDateForCreditCard(date1: Date, dateStr2: string) {
    const parts = dateStr2.split('/');
    const month2 = parseInt(parts[0], 10) - 1 // Soustraire 1 car les mois dans les objets Date commencent à 0
    const year2 = parseInt(parts[1], 10) + 2000 // Ajouter 2000 pour les années à deux chiffres

    const nextMonth = new Date(year2, month2 + 1, 1)
    const lastDayOfMonth = new Date((nextMonth as any) - 1)

    // Comparer les dates
    if (date1 > lastDayOfMonth) {
        return false;
    } else if (date1 < lastDayOfMonth) {
        return true;
    } else {
        return true;
    }
}
