import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneDropdown
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './GreetingWebPart.module.scss';
import { IGreetingWebPartProps } from './IGreetingWebPartProps';

export default class GreetingWebPart extends BaseClientSideWebPart<IGreetingWebPartProps> {

  public render(): void {
    const displayName = this.context.pageContext.user.displayName;
    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    let greeting: string;
    if (currentHour < 12) {
      greeting = `${this.properties.morningGreeting}, ${displayName}!`;
    } else if (currentHour < 18) {
      greeting = `${this.properties.afternoonGreeting}, ${displayName}!`;
    } else {
      greeting = `${this.properties.eveningGreeting}, ${displayName}!`;
    }

    const greetingStyle = {
      fontSize: `${this.properties.fontSize}px`,
      color: this.properties.textColor,
      margin: '0px',
      background: this.properties.showTransparentBackground ? 'transparent' : 'inherit',
      backgroundColor: this.properties.showTransparentBackground ? 'transparent' : 'inherit',
      textAlign: this.properties.textAlignment || 'center'
    };

    const containerStyle = {
      height: 'auto',
      display: 'flex',
      alignItems: this.properties.verticalAlignment === 'top' ? 'flex-start' :
                 this.properties.verticalAlignment === 'bottom' ? 'flex-end' : 'center',
      justifyContent: 'center', // Always center the h1 element horizontally
      textAlign: this.properties.textAlignment || 'center'
    };

    // Add CSS custom property for responsive design
    if (this.properties.enableResponsiveDesign) {
      this.domElement.style.setProperty('--greeting-font-size', `${this.properties.fontSize}px`);
    }

    const containerClasses = [
      styles.greeting,
      this.properties.showTransparentBackground ? styles.forceTransparent : '',
      this.properties.enableResponsiveDesign ? 'responsive' : ''
    ].filter(cls => cls).join(' ');

    this.domElement.innerHTML = `
      <div class="${containerClasses}"
           style="height: ${containerStyle.height};
                  display: ${containerStyle.display};
                  align-items: ${containerStyle.alignItems};
                  justify-content: ${containerStyle.justifyContent};
                  width: 100%;
                  box-sizing: border-box;
                  text-align: ${containerStyle.textAlign};">
        <h1 id="greeting-${this.context.instanceId}"
            style="font-size: ${greetingStyle.fontSize};
                   color: ${greetingStyle.color};
                   margin: ${greetingStyle.margin};
                   background: ${greetingStyle.background};
                   background-color: ${greetingStyle.backgroundColor};
                   text-align: inherit;
                   width: auto;
                   flex: 0 0 auto;">
          ${escape(greeting)}
        </h1>
      </div>
    `;

    if (this.properties.showTransparentBackground) {
      this._forceTransparentBackground();
    }
  }

  private _forceTransparentBackground(): void {
    const elementId = `greeting-${this.context.instanceId}`;
    const element = document.getElementById(elementId);

    if (element) {
      element.style.setProperty('background', 'none', 'important');
      element.style.setProperty('background-color', 'transparent', 'important');

      let parent = element.parentElement;
      let levels = 0;
      while (parent && levels < 5) { // Increased levels for full-width sections
        parent.style.setProperty('background', 'none', 'important');
        parent.style.setProperty('background-color', 'transparent', 'important');

        // Target SharePoint specific canvas elements
        if (parent.classList.contains('CanvasComponent') ||
            parent.classList.contains('CanvasZone') ||
            parent.classList.contains('SPCanvas') ||
            parent.dataset.spCanvascontrol) {
          parent.style.setProperty('background', 'transparent', 'important');
          parent.style.setProperty('background-color', 'transparent', 'important');
          parent.style.setProperty('width', '100%', 'important');
        }

        parent = parent.parentElement;
        levels++;
      }
    }

    setTimeout(() => this._forceTransparentBackground(), 500);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "Customize your greeting message"
          },
          groups: [
            {
              groupName: "Greeting Settings",
              groupFields: [
                PropertyPaneTextField('morningGreeting', {
                  label: 'Morning Greeting',
                  description: 'Greeting message for morning (before 12 PM)'
                }),
                PropertyPaneTextField('afternoonGreeting', {
                  label: 'Afternoon Greeting',
                  description: 'Greeting message for afternoon (12 PM - 6 PM)'
                }),
                PropertyPaneTextField('eveningGreeting', {
                  label: 'Evening Greeting',
                  description: 'Greeting message for evening (after 6 PM)'
                })
              ]
            },
            {
              groupName: "Appearance",
              groupFields: [
                PropertyPaneSlider('fontSize', {
                  label: 'Font Size',
                  min: 12,
                  max: 64,
                  step: 1,
                  showValue: true
                }),
                PropertyPaneTextField('textColor', {
                  label: 'Text Color',
                  description: 'CSS color value (e.g., #000000, red, rgb(0,0,0))'
                }),
                PropertyPaneDropdown('textAlignment', {
                  label: 'Text Alignment',
                  options: [
                    { key: 'left', text: 'Left' },
                    { key: 'center', text: 'Center' },
                    { key: 'right', text: 'Right' }
                  ],
                  selectedKey: this.properties.textAlignment || 'left'
                }),
                PropertyPaneToggle('showTransparentBackground', {
                  label: 'Transparent Background',
                  onText: 'Enabled',
                  offText: 'Disabled'
                }),
                PropertyPaneToggle('enableResponsiveDesign', {
                  label: 'Responsive Design',
                  onText: 'Enabled',
                  offText: 'Disabled'
                })
              ]
            },
            {
              groupName: "Layout",
              groupFields: [
                PropertyPaneDropdown('verticalAlignment', {
                  label: 'Vertical Alignment',
                  options: [
                    { key: 'top', text: 'Top' },
                    { key: 'center', text: 'Center' },
                    { key: 'bottom', text: 'Bottom' }
                  ],
                  selectedKey: this.properties.verticalAlignment || 'center'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}