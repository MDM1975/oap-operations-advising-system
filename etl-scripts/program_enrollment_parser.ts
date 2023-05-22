interface Program_Enrollment_Mapper {
    Program_Enrollment_Mapper_Code: string;
    Program: string;
    Student: string;
    Advisor: string;
    Entry_Semester: string;
    Projected_Graduation_Semester: string;
}

function main(workbook: ExcelScript.Workbook): void {
    const table = workbook.getActiveWorksheet().getUsedRange();
    const programEnrollmentData = programEnrollmentParser(table);
    const programEnrollmentColumns = ["Program Enrollment Mapper Code", "Program", "Student", "Advisor", "Entry Semester", "Projected Graduation Semester"];
    const programEnrollmentSheet = workbook.addWorksheet("Program_Enrollment");

    programEnrollmentSheet.getRangeByIndexes(0, 0, 1, programEnrollmentColumns.length).setValues([programEnrollmentColumns]);

    programEnrollmentData.forEach((programEnrollment, index) => {
        programEnrollmentSheet.getRangeByIndexes(index + 1, 0, 1, programEnrollmentColumns.length).setValues([Object.values(programEnrollment)]);
    });

    programEnrollmentSheet.activate();
}

function programEnrollmentParser(table: ExcelScript.Range): Program_Enrollment_Mapper[] {
    const [columns, ...rows]: string[][] = table.getValues() as string[][];
    const programEnrollmentCodes: Set<String> = new Set<String>();
    const programEnrollments: Program_Enrollment_Mapper[] = [];

    rows.forEach(row => {
        const program = row[columns.indexOf("Program")];
        const student = row[columns.indexOf("Student ID")];
        const advisor = row[columns.indexOf("Advisor ID")];
        const entrySemester = row[columns.indexOf("Entry Point")];
        const projectedGraduationSemester = row[columns.indexOf("Projected Graduation")];
        const programEnrollmentCode = `${student}${program}`;

        if (!programEnrollmentCodes.has(programEnrollmentCode)) {
            programEnrollmentCodes.add(programEnrollmentCode);
            programEnrollments.push({
                Program_Enrollment_Mapper_Code: programEnrollmentCode,
                Program: program,
                Student: student,
                Advisor: advisor,
                Entry_Semester: entrySemester,
                Projected_Graduation_Semester: projectedGraduationSemester,
            });
        }
    });

    return programEnrollments;
}