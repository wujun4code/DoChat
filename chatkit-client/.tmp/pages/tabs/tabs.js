import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { ContactPage } from '../contact/contact';
import { DiscoverPage } from '../discover/discover';
import { ProfilePage } from '../profile/profile';
export var TabsPage = (function () {
    function TabsPage() {
        // this tells the tabs component which Pages
        // should be each tab's root Page
        this.tab1Root = HomePage;
        this.tab2Root = ContactPage;
        this.tab3Root = DiscoverPage;
        this.tab4Root = ProfilePage;
    }
    TabsPage.decorators = [
        { type: Component, args: [{
                    templateUrl: 'tabs.html'
                },] },
    ];
    /** @nocollapse */
    TabsPage.ctorParameters = [];
    return TabsPage;
}());
