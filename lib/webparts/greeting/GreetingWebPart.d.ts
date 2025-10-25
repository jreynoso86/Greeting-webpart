import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IGreetingWebPartProps } from './IGreetingWebPartProps';
export default class GreetingWebPart extends BaseClientSideWebPart<IGreetingWebPartProps> {
    render(): void;
    private _forceTransparentBackground;
    protected get dataVersion(): Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=GreetingWebPart.d.ts.map