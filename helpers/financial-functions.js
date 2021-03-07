const financialFunctions = {}

financialFunctions.getPeriodicPayment = (totalLoanAmount, annualInterestRate, paymentsPerYear, loanDurationYears) => {
    const n = paymentsPerYear * loanDurationYears;
    const r = annualInterestRate / paymentsPerYear;
    const discountFactor = (((1 + r) ** n) - 1) / (r * ((1 + r) ** n));

    return (Number(totalLoanAmount) / discountFactor).toFixed(2);
}

financialFunctions.getAmountExpectedBy = (commencementDate, currentDate, loanInCents, annualInterestRate, paymentsPerYear, numberOfYears) => {
    const monthMilliseconds = 4 * 7 * 24 * 60 * 60 * 1000;
    const fortnightMilliseconds = 2 * 7 * 24 * 60 * 60 * 1000;
    const weekMilliseconds = 7 * 24 * 60 * 60 * 1000;

    let intervalInMilliseconds = 0;

    switch (paymentsPerYear) {
        case 12:
            intervalInMilliseconds = monthMilliseconds;
            break;
        case 26:
            intervalInMilliseconds = fortnightMilliseconds;
            break;
        case 52:
            intervalInMilliseconds = weekMilliseconds;
            break;
        default:
            throw error("TODO");
    }

    const intervalsElapsed = Math.floor((new Date(currentDate) - new Date(commencementDate)) / intervalInMilliseconds);
    const paymentPerInterval = financialFunctions.getPeriodicPayment(loanInCents, annualInterestRate, paymentsPerYear, numberOfYears);

    return paymentPerInterval * intervalsElapsed;
}

export default financialFunctions;