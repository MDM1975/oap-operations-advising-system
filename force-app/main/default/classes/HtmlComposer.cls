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