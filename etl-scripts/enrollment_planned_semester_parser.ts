interface Enrollment_Planned_Semester_Mapper {
    Enrollment_Planned_Semester_Mapper_Code: string;
    Program_Enrollment_Mapper_Code: string;
    Semester: string;
}

function main(workbook: ExcelScript.Workbook): void {
    const table = workbook.getActiveWorksheet().getUsedRange();
    const enrollmentPlannedSemesterData = enrollmentPlannedSemesterParser(table);
    const enrollmentPlannedSemesterColumns = ["Enrollment Planned Semester Mapper Code", "Program Enrollment Mapper Code", "Semester"];
    const enrollmentPlannedSemesterSheet = workbook.addWorksheet("Enrollment_Planned_Semester");

    enrollmentPlannedSemesterSheet.getRangeByIndexes(0, 0, 1, enrollmentPlannedSemesterColumns.length).setValues([enrollmentPlannedSemesterColumns]);

  Array.from(enrollmentPlannedSemesterData).forEach((plannedSemester, index) => {
        enrollmentPlannedSemesterSheet.getRangeByIndexes(index + 1, 0, 1, enrollmentPlannedSemesterColumns.length).setValues([Object.values(plannedSemester)]);
    });

    enrollmentPlannedSemesterSheet.activate();
}

function enrollmentPlannedSemesterParser(table: ExcelScript.Range): Set<Enrollment_Planned_Semester_Mapper> {
    const [columns, ...rows]: string[][] = table.getValues() as string[][];
    const courseColumns: number[] = columns.map((column) => column.includes("Course") ? columns.indexOf(column) : null).filter(column => column) as number[];
    const enrollmentPlannedSemesters: Set<Enrollment_Planned_Semester_Mapper> = new Set < Enrollment_Planned_Semester_Mapper>();

    rows.forEach(row => {
        courseColumns.forEach(column => {
            if (row[column]) {
                const [year, session] = row[column].split(" ");
                const semester = `${year} ${session}`;
                const studentId = row[columns.indexOf("Student ID")];
                const program = row[columns.indexOf("Program")];
                const plannedSemesters: Set<String> = new Set<String>();

                if (!plannedSemesters.has(semester)) {
                    plannedSemesters.add(semester);
                    enrollmentPlannedSemesters.add({
                        Enrollment_Planned_Semester_Mapper_Code: `${studentId}${program}${semester.replace(/\s|\./g, "")}`,
                        Program_Enrollment_Mapper_Code: `${studentId}${program}`,
                        Semester: semester
                    });
                }
            }
        });
    });

    return enrollmentPlannedSemesters;
}