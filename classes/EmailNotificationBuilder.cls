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