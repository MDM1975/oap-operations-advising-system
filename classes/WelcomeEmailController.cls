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
                    'mdm1975@uncw.edu', 
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
                                    'Hi {0}, <br><br> Congratulations on being accepted into the {1} program at UNC Wilmington starting in the {2} session.',
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
                                            'I would like to set up an initial meeting to get some background information from you, decide on your first classes, and answer any questions you might have. Face-to-face conversations over Zoom are highly preferred by the Cameron Advising Team and myself. However, if you cannot meet over Zoom for any reason, you can elect to do a phone call instead by selecting this option when making your appointment on Starfish. Before we can schedule this call, you will need to log in to your UNCW email account to be sure it&aposs active. Once you know your UNCW email is active, please use this link to {0}',
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
                                        'I have sent this information to your personal email address in case you are&apost yet regularly checking your UNCW email. However, moving forward, I would like to use your UNCW email address as our primary form of communication. Your UNCW email address is cc&aposed on this message, and here is a link with further information on your next steps, including email access: <a href="https://uncw.edu/gradschool/admissions/oap.html">Next Steps</a>.'
                                    )
                            )
                            .subcontainer(
                                new HtmlComposer()
                                    .text('<br><br> Respectfully, <br>')
                                    .text(
                                        String.format(
                                            '{0} <br>' +
                                                'Student Success Advisor <br>' +
                                                'Graduate Programs | Cameron School of Business <br>' +
                                                'University of North Carolina Wilmington <br>' +
                                                '{1}' +
                                                '<br><br>',
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
                                        'How did we do? Please take one minute to <a href="https://uncw.az1.qualtrics.com/jfe/form/SV_9LlEwp6AnPl79Xw">rate your experience.</a>'
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