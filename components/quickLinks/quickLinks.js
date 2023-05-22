import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class QuickLinks extends NavigationMixin(LightningElement) {
    get mySeaPortUrl() {
        return 'https://uncw4.sharepoint.com/';
    }

    get seaNetUrl() {
        return 'https://seanet.uncw.edu/';
    }

    get starFishUrl() {
        return 'https://myapps.microsoft.com/signin/Starfish/3ae88442-b19c-4712-ac3e-484eff0239d0';
    }

    handleNavigation(event) {
        const { url } = event.currentTarget.dataset;
        this.navigateToUrl(url);
    }

    navigateToUrl(url) {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: { url }
        });
    }
}