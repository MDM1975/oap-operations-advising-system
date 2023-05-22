interface Enrollment_Planned_Course_Mapper {
  Course: string;
  Enrollment_Planned_Semester_Mapper_Code: string;
}

function main(workbook: ExcelScript.Workbook): void {
  const table = workbook.getActiveWorksheet().getUsedRange();
  const enrollmentPlannedCourseData =
    enrollmentPlannedCourseParser(table);
  const enrollmentPlannedCourseColumns = [
    'Course',
    'Enrollment Planned Semester Mapper Code',
  ];
  const enrollmentPlannedCourseSheet = workbook.addWorksheet(
    'Enrollment_Planned_Course'
  );

  enrollmentPlannedCourseSheet
    .getRangeByIndexes(
      0,
      0,
      1,
      enrollmentPlannedCourseColumns.length
    )
    .setValues([enrollmentPlannedCourseColumns]);

  Array.from(enrollmentPlannedCourseData).forEach(
    (plannedCourse, index) => {
      enrollmentPlannedCourseSheet
        .getRangeByIndexes(
          index + 1,
          0,
          1,
          enrollmentPlannedCourseColumns.length
        )
        .setValues([Object.values(plannedCourse)]);
    }
  );

  enrollmentPlannedCourseSheet.activate();
}

function enrollmentPlannedCourseParser(
  table: ExcelScript.Range
): Set<Enrollment_Planned_Course_Mapper> {
  const [columns, ...rows]: string[][] =
    table.getValues() as string[][];
  const enrollmentPlannedCourses: Set<Enrollment_Planned_Course_Mapper> =
    new Set<Enrollment_Planned_Course_Mapper>();
  const courseColumns: number[] = columns
    .map((column) =>
      column.includes('Course') ? columns.indexOf(column) : null
    )
    .filter((column) => column) as number[];

  rows.forEach((row) => {
    courseColumns.forEach((column) => {
      if (row[column]) {
        const [year, session, prefix, number] =
          row[column].split(' ');
        const semester = `${year} ${session}`;
        const course = `${prefix} ${number}`;
        const studentId = row[columns.indexOf('Student ID')];
        const program = row[columns.indexOf('Program')];

        enrollmentPlannedCourses.add({
          Course: course,
          Enrollment_Planned_Semester_Mapper_Code: `${studentId}${program}${semester.replace(
            /\s|\./g,
            ''
          )}`,
        });
      }
    });
  });

  return enrollmentPlannedCourses;
}
