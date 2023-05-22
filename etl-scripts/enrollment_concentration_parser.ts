interface Enrollment_Concentration_Mapper {
    Program_Enrollment_Mapper_Code: string;
    Concentration: string;
}

function main(workbook: ExcelScript.Workbook): void {
    const table = workbook.getActiveWorksheet().getUsedRange();
    const enrollmentConcentrationData = enrollmentConcentrationParser(table);
    const enrollmentConcentrationColumns = ["Program Enrollment Mapper Code", "Concentration"];
    const enrollmentConcentrationSheet = workbook.addWorksheet("Enrollment_Concentration")

    enrollmentConcentrationSheet.getRangeByIndexes(0, 0, 1, enrollmentConcentrationColumns.length).setValues([enrollmentConcentrationColumns]);

    enrollmentConcentrationData.forEach((enrollmentConcentration, index) => {
        enrollmentConcentrationSheet.getRangeByIndexes(index + 1, 0, 1, enrollmentConcentrationColumns.length).setValues([Object.values(enrollmentConcentration)]);
    });

    enrollmentConcentrationSheet.activate();
}

function enrollmentConcentrationParser(table: ExcelScript.Range): Enrollment_Concentration_Mapper[] {
    const [columns, ...rows]: string[][] = table.getValues() as string[][];
    const enrollmentConcentrations: Enrollment_Concentration_Mapper[] = [];

    rows.forEach(row => {
        columns.filter(column => column.includes("Concentration")).forEach(column => {
            const concentration = row[columns.indexOf(column)];
            const studentId = row[columns.indexOf("Student ID")];
            const program = row[columns.indexOf("Program")];

            if (row[columns.indexOf(column)]) {
                enrollmentConcentrations.push({
                    Program_Enrollment_Mapper_Code: `${studentId}${program}`,
                    Concentration: concentration
                });
            }
        });
    });

    return enrollmentConcentrations;
}