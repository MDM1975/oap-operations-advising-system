interface Student_Mapper {
    Student_University_Id: string;
    First_Name: string;
    Last_Name: string;
    Email: string;
}

function main(workbook: ExcelScript.Workbook): void {
    const table = workbook.getActiveWorksheet().getUsedRange();
    const studentData = studentParser(table);
    const studentColumns = ["Student University Id", "First Name", "Last Name", "Email"];
    const studentSheet = workbook.addWorksheet("Student");

    studentSheet.getRangeByIndexes(0, 0, 1, studentColumns.length).setValues([studentColumns]);

    studentData.forEach((student, index) => {
        studentSheet.getRangeByIndexes(index + 1, 0, 1, studentColumns.length).setValues([Object.values(student)]);
    });

    studentSheet.activate();
}

function studentParser(table: ExcelScript.Range): Student_Mapper[] {
    const [columns, ...rows]: string[][] = table.getValues() as string[][];
    const studentIds: Set<String> = new Set<String>();
    const students: Student_Mapper[] = [];

    rows.forEach(row => {
        if (!studentIds.has(row[columns.indexOf("Student ID")])) {
            const studentId = row[columns.indexOf("Student ID")];
            const first = row[columns.indexOf("First Name")]
            const last = row[columns.indexOf("Last Name")]
            const email = row[columns.indexOf("Email Address")];

            students.push({
                Student_University_Id: studentId,
                First_Name: first,
                Last_Name: last,
                Email: email
            });

            studentIds.add(studentId);
        }
    });

    return students;
}