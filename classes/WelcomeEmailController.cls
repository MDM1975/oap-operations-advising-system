public class WelcomeEmailController {
    private static EmailNotificationBuilder builder;
    private static Program_Enrollment__c enrollment;
    private static List<String> conditions;

    @AuraEnabled
    public static void sendWelcomeEmail(Id programEnrollmentId) {
        WelcomeEmailController.builder = new EmailNotificationBuilder();
        WelcomeEmailController.enrollment = WelcomeEmailController.getProgramEnrollment(programEnrollmentId);
        WelcomeEmailController.conditions = WelcomeEmailController.getEnrollmentConditions(programEnrollmentId);
        WelcomeEmailController.buildWelcomeEmail();
        Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{ 
            WelcomeEmailController.builder.getEmailNotification() 
        });
    }

    private static void buildWelcomeEmail() {
        WelcomeEmailController.builder
            .setSubject('Welcome to CSB Grad Programs!')
            .setToAddress(WelcomeEmailController.enrollment.Student__r.Email)
            .setCcAddresses(
                new List<String>{
                    WelcomeEmailController.enrollment.Advisor__r.Email, 
                    WelcomeEmailController.enrollment.Student__r.UNCW_Email__c 
                }
            )
            .setReplyTo(WelcomeEmailController.enrollment.Advisor__r.Email)
            .setOrgWideEmailAddressId(WelcomeEmailController.getOrgWideEmailAddressId())
            .setHtmlContent(
                new HtmlComposer()
                    .container(
                        new HtmlComposer()
                            .text(
                                String.format(
                                    Welcome_Email_Template__mdt.Welcome_Email_Intro__c,
                                    new List<String>{
                                        WelcomeEmailController.enrollment.Student__r.FirstName,
                                        WelcomeEmailController.enrollment.Program__r.Program_Title__c,
                                        WelcomeEmailController.enrollment.Entry_Semester__r.Semester_Title__c
                                    }
                                )
                            )
                            .subcontainer(new HtmlComposer().foreach(WelcomeEmailController.conditions))
                            .subcontainer(
                                new HtmlComposer()
                                    .text(
                                        String.format(
                                            Welcome_Email_Template__mdt.Welcome_Email_Body_1__c,
                                            new List<String>{
                                                new HtmlComposer()
                                                    .link('set up an appointment')
                                                    .attribute(
                                                        'href', 
                                                        WelcomeEmailController.enrollment.Advisor__r.Appointment_Link__c
                                                    )
                                                    .compose()
                                            }
                                        )
                                    )
                            )
                            .subcontainer(
                                new HtmlComposer()
                                    .text(
                                        Welcome_Email_Template__mdt.Welcome_Email_Body_2__c
                                    )
                            )
                            .subcontainer(
                                new HtmlComposer()
                                    .text(
                                        String.format(
                                            Welcome_Email_Template__mdt.Welcome_Email_Signature__c,
                                            new List<String>{ 
                                                WelcomeEmailController.enrollment.Advisor__r.Name, 
                                                WelcomeEmailController.enrollment.Advisor__r.Phone
                                            }
                                        )
                                    )
                            )
                            .subcontainer(
                                new HtmlComposer()
                                    .text(
                                        
                                    )
                            )
                            .centersubcontainer(
                                new HtmlComposer()
                                    .linebreak()
                                    .text(
                                        String.format(
                                            '&copy; {0} University of North Carolina Wilmington',
                                            new List<String>{ System.today().year().format().remove(',') }
                                        )
                                    )
                            )
                    )
            );
    }

    private static Program_Enrollment__c getProgramEnrollment(Id programEnrollmentId) {
        return [
            SELECT
                Advisor__r.Name,
                Advisor__r.Email,
                Advisor__r.Phone,
                Advisor__r.Appointment_Link__c,
                Student__r.FirstName,
                Student__r.Email,
                Student__r.UNCW_Email__c,
                Program__r.Program_Title__c,
                Entry_Semester__r.Semester_Title__c
            FROM Program_Enrollment__c
            WHERE Id = :programEnrollmentId
        ];
    }

    private static List<String> getEnrollmentConditions(Id programEnrollmentId) {
        List<String> conditions = new List<String>();

        for (Applied_Enrollment_Condition__c appliedCondition : [
            SELECT Enrollment_Condition__r.Description__c
            FROM Applied_Enrollment_Condition__c
            WHERE Program_Enrollment__c = :programEnrollmentId
        ]) {
            conditions.add(appliedCondition.Enrollment_Condition__r.Description__c);
        }

        return conditions;
    }

    private static Id getOrgWideEmailAddressId() {
        return [
            SELECT Id
            FROM OrgWideEmailAddress
            WHERE DisplayName = 'CSB Graduate Programs'
        ]
        .Id;
    }
}