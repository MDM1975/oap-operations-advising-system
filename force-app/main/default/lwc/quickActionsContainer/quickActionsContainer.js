import { LightningElement } from 'lwc';
import { Query } from 'c/lib';
import CONTEXT_USER from '@salesforce/user/Id';

export default class QuickActionsContainer extends LightningElement {
    _isStudentOnboardingUser;

    get isStudentOnboardingUser() {
        return this._isStudentOnboardingUser && this._isStudentOnboardingUser?.length > 0;
    }

    async connectedCallback() {
        this._isStudentOnboardingUser = await new Query()
            .select(['Id'])
            .from('GroupMember')
            .where([
                'UserOrGroupId',
                '=',
                CONTEXT_USER
            ])
            .andWhere([
                'Group.DeveloperName',
                '=',
                'Student_Onboarding'
            ])
            .submit();
    }

    handleReminderQuickAction() {
        this.template.querySelector('c-new-reminder-form').open();
    }

    handleStudentQuickAction() {
        this.template.querySelector('c-new-student-form').open();
    }

    handleCaseQuickAction() {
        this.template.querySelector('c-new-case-form').open();
    }
}