public class HtmlComposer {
    private final List<String> html;

    public HtmlComposer() {
        this.html = new List<String>();
    }

    public HtmlComposer container(HtmlComposer content) {
        this.html.add(
            this.toHtml('div', content.compose()).replaceFirst('>', ' style="margin: 0 auto;padding: 1rem;">')
        );
        return this;
    }

    public HtmlComposer subcontainer(HtmlComposer content) {
        this.html.add(this.toHtml('div', content.compose()).replaceFirst('>', ' style="margin: 0 auto;">'));
        return this;
    }

    public HtmlComposer centersubcontainer(HtmlComposer content) {
        this.html.add(
            this.toHtml('div', content.compose())
                .replaceFirst('>', ' style="text-align: center;margin: 0 auto;padding: 1rem;">')
        );
        return this;
    }

    public HtmlComposer linebreak() {
        this.html.add(
            this.toHtml('span', '')
                .replaceFirst(
                    '>',
                    ' style="display: block;border-top: 1px solid #ccc;margin: 0 auto;padding: 1rem;width: 85%;">'
                )
        );
        return this;
    }

    public HtmlComposer text(String content) {
        this.html.add(this.toHtml('p', content));
        return this;
    }

    public HtmlComposer bold(String content) {
        this.html.add(this.toHtml('b', content));
        return this;
    }

    public HtmlComposer span(String content) {
        this.html.add(this.toHtml('span', content));
        return this;
    }

    public HtmlComposer link(String content) {
        this.html.add(this.toHtml('a', content));
        return this;
    }

    public HtmlComposer foreach(Object content) {
        if (content instanceof Map<String, Object>) {
            for (String key : ((Map<String, Object>) content).keySet()) {
                this.html.add(
                    this.toHtml(
                        'p',
                        String.format(
                            '{0}: {1}',
                            new List<Object>{ this.toHtml('b', key), ((Map<String, Object>) content).get(key) }
                        )
                    )
                );
            }
            return this;
        }

        for (Object item : (List<Object>) content) {
            this.html.add(this.toHtml('p', item));
        }
        return this;
    }

    public HtmlComposer style(String property, String value) {
        String element = this.html[this.html.size() - 1];
        String styleValue = String.format('{0}: {1};', new List<String>{ property, value });
        String elementStyle = element.contains('style="')
            ? element.replaceFirst('style="', 'style="' + styleValue)
            : element.replaceFirst('>', ' style="' + styleValue + '">');
        this.html[this.html.size() - 1] = elementStyle;
        return this;
    }

    public HtmlComposer attribute(String attribute, String value) {
        String element = this.html[this.html.size() - 1];
        String attributeValue = String.format('{0}="{1}"', new List<String>{ attribute, value });
        String elementAttribute = element.contains(attributeValue)
            ? element
            : element.replaceFirst('>', ' ' + attributeValue + '>');
        this.html[this.html.size() - 1] = elementAttribute;
        return this;
    }

    private String toHtml(String tag, Object content) {
        return String.format('<{0}>{1}</{0}>', new List<Object>{ tag, content });
    }

    public String compose() {
        return String.join(this.html, '');
    }
}

public class EmailNotificationBuilder {
    private final Messaging.SingleEmailMessage email;

    public EmailNotificationBuilder() {
        this.email = new Messaging.SingleEmailMessage();
    }

    public EmailNotificationBuilder setSubject(String subject) {
        this.email.setSubject(subject);
        return this;
    }

    public EmailNotificationBuilder setToAddress(String recipient) {
        this.email.setToAddresses(new List<String>{ recipient });
        return this;
    }

    public EmailNotificationBuilder setToAddresses(List<String> recipients) {
        this.email.setToAddresses(recipients);
        return this;
    }

    public EmailNotificationBuilder setCcAddresses(List<String> ccAddresses) {
        this.email.setCcAddresses(ccAddresses);
        return this;
    }

    public EmailNotificationBuilder setReplyTo(String replyTo) {
        this.email.setReplyTo(replyTo);
        return this;
    }

    public EmailNotificationBuilder setOrgWideEmailAddressId(Id orgWideEmailAddressId) {
        this.email.setOrgWideEmailAddressId(orgWideEmailAddressId);
        return this;
    }

    public EmailNotificationBuilder setHtmlContent(HtmlComposer content) {
        this.email.setHtmlBody(content.compose());
        return this;
    }

    public Messaging.SingleEmailMessage getEmailNotification() {
        return this.email;
    }
}

public class WelcomeEmailHandler implements ITriggerHandler {
    private final EmailNotificationBuilder builder;
    private Program_Enrollment__c enrollment;
    private List<String> conditions;

    public WelcomeEmailHandler() {
        this.builder = new EmailNotificationBuilder();
    }

    public Messaging.SendEmailResult execute(TriggerState.Record record) {
        this.enrollment = this.getProgramEnrollment(record.getRecord().Id);
        this.conditions = this.getEnrollmentConditions(record.getRecord().Id);
        this.buildWelcomeEmail();
        return Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{ builder.getEmailNotification() })[0];
    }

    private void buildWelcomeEmail() {
        this.builder
            .setSubject('Welcome to CSB Grad Programs!')
            .setToAddress(enrollment.Student__r.Email)
            .setCcAddresses(
                new List<String>{ 'mdm1975@uncw.edu', enrollment.Advisor__r.Email, enrollment.Student__r.UNCW_Email__c }
            )
            .setReplyTo(enrollment.Advisor__r.Email)
            .setOrgWideEmailAddressId(this.getOrgWideEmailAddressId())
            .setHtmlContent(
                new HtmlComposer()
                    .container(
                        new HtmlComposer()
                            .text(
                                String.format(
                                    'Hi {0}, <br><br> Congratulations on being accepted into the {1} program at UNC Wilmington starting in the {2} session.',
                                    new List<String>{
                                        enrollment.Student__r.FirstName,
                                        enrollment.Program__r.Program_Title__c,
                                        enrollment.Entry_Semester__r.Semester_Title__c
                                    }
                                )
                            )
                            .subcontainer(new HtmlComposer().foreach(conditions))
                            .subcontainer(
                                new HtmlComposer()
                                    .text(
                                        String.format(
                                            'I would like to set up an initial meeting to get some background information from you, decide on your first classes, and answer any questions you might have. Face-to-face conversations over Zoom are highly preferred by the Cameron Advising Team and myself. However, if you cannot meet over Zoom for any reason, you can elect to do a phone call instead by selecting this option when making your appointment on Starfish. Before we can schedule this call, you will need to log in to your UNCW email account to be sure it&aposs active. Once you know your UNCW email is active, please use this link to {0}',
                                            new List<String>{
                                                new HtmlComposer()
                                                    .link('set up an appointment')
                                                    .attribute('href', enrollment.Advisor__r.Appointment_Link__c)
                                                    .compose()
                                            }
                                        )
                                    )
                            )
                            .subcontainer(
                                new HtmlComposer()
                                    .text(
                                        'I have sent this information to your personal email address in case you are&apost yet regularly checking your UNCW email. However, moving forward, I would like to use your UNCW email address as our primary form of communication. Your UNCW email address is cc&aposed on this message, and here is a link with further information on your next steps, including email access: <a href='https://uncw.edu/gradschool/admissions/oap.html'>Next Steps</a>.'
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
                                            new List<String>{ enrollment.Advisor__r.Name, enrollment.Advisor__r.Phone }
                                        )
                                    )
                            )
                            .subcontainer(
                                new HtmlComposer()
                                    .text(
                                        'How did we do? Please take one minute to <a href='https://uncw.az1.qualtrics.com/jfe/form/SV_9LlEwp6AnPl79Xw'>rate your experience.</a>'
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

    private Program_Enrollment__c getProgramEnrollment(Id programEnrollmentId) {
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

    private List<String> getEnrollmentConditions(Id programEnrollmentId) {
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

    private Id getOrgWideEmailAddressId() {
        return [
            SELECT Id
            FROM OrgWideEmailAddress
            WHERE DisplayName = 'CSB Graduate Programs'
        ]
        .Id;
    }
}


