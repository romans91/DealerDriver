const queryBuilder = {};

queryBuilder.buildMultipleColumnUpdateQuery = (columnsAndNewValuesJson, columnsToConvertToCents, columnsToReturn, tableName, primaryKeyName, primaryKeyValue) => {
    let columnsAndNewValues = JSON.stringify(columnsAndNewValuesJson).replace(/"/g, `'`).replace(/(?<=\D):/g, ` = `).replace(/{|}/g, ``).split(/,(?=(?:(?:[^']*'){2})*[^']*$)/);

    for (let i = 0; i < columnsAndNewValues.length; i++) {
        columnsAndNewValues[i] = columnsAndNewValues[i].replace(`'`, ``).replace(`'`, ``);

        let columnAndValue = columnsAndNewValues[i].split(` = `);

        if (columnsToConvertToCents.includes(columnAndValue[0])) {
            columnsAndNewValues[i] = `${columnAndValue[0]}_cents=${columnAndValue[1] * 100}`;
        }
    }

    for (let i = 0; i < columnsToReturn.length; i++) {
        if (columnsToConvertToCents.includes(columnsToReturn[i])) {
            columnsToReturn[i] = `CAST(${columnsToReturn[i]}_cents * 1.0 / 100 AS float) as ${columnsToReturn[i]}`;
        }
    }

    return `UPDATE ${tableName} 
            SET ${columnsAndNewValues.join(`, `)}
            WHERE ${primaryKeyName} = '${primaryKeyValue}'
            RETURNING ${columnsToReturn.join(', ')}`;
};

export default queryBuilder;