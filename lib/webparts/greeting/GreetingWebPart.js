var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Version } from '@microsoft/sp-core-library';
import { PropertyPaneTextField, PropertyPaneSlider, PropertyPaneToggle, PropertyPaneDropdown } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';
import styles from './GreetingWebPart.module.scss';
var GreetingWebPart = /** @class */ (function (_super) {
    __extends(GreetingWebPart, _super);
    function GreetingWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GreetingWebPart.prototype.render = function () {
        var displayName = this.context.pageContext.user.displayName;
        var currentDate = new Date();
        var currentHour = currentDate.getHours();
        var greeting;
        if (currentHour < 12) {
            greeting = "".concat(this.properties.morningGreeting, ", ").concat(displayName, "!");
        }
        else if (currentHour < 18) {
            greeting = "".concat(this.properties.afternoonGreeting, ", ").concat(displayName, "!");
        }
        else {
            greeting = "".concat(this.properties.eveningGreeting, ", ").concat(displayName, "!");
        }
        var greetingStyle = {
            fontSize: "".concat(this.properties.fontSize, "px"),
            color: this.properties.textColor,
            margin: '0px',
            background: this.properties.showTransparentBackground ? 'transparent' : 'inherit',
            backgroundColor: this.properties.showTransparentBackground ? 'transparent' : 'inherit',
            textAlign: this.properties.textAlignment || 'center'
        };
        var containerStyle = {
            height: 'auto',
            display: 'flex',
            alignItems: this.properties.verticalAlignment === 'top' ? 'flex-start' :
                this.properties.verticalAlignment === 'bottom' ? 'flex-end' : 'center',
            justifyContent: 'center',
            textAlign: this.properties.textAlignment || 'center'
        };
        // Add CSS custom property for responsive design
        if (this.properties.enableResponsiveDesign) {
            this.domElement.style.setProperty('--greeting-font-size', "".concat(this.properties.fontSize, "px"));
        }
        var containerClasses = [
            styles.greeting,
            this.properties.showTransparentBackground ? styles.forceTransparent : '',
            this.properties.enableResponsiveDesign ? 'responsive' : ''
        ].filter(function (cls) { return cls; }).join(' ');
        this.domElement.innerHTML = "\n      <div class=\"".concat(containerClasses, "\"\n           style=\"height: ").concat(containerStyle.height, ";\n                  display: ").concat(containerStyle.display, ";\n                  align-items: ").concat(containerStyle.alignItems, ";\n                  justify-content: ").concat(containerStyle.justifyContent, ";\n                  width: 100%;\n                  box-sizing: border-box;\n                  text-align: ").concat(containerStyle.textAlign, ";\">\n        <h1 id=\"greeting-").concat(this.context.instanceId, "\"\n            style=\"font-size: ").concat(greetingStyle.fontSize, ";\n                   color: ").concat(greetingStyle.color, ";\n                   margin: ").concat(greetingStyle.margin, ";\n                   background: ").concat(greetingStyle.background, ";\n                   background-color: ").concat(greetingStyle.backgroundColor, ";\n                   text-align: inherit;\n                   width: auto;\n                   flex: 0 0 auto;\">\n          ").concat(escape(greeting), "\n        </h1>\n      </div>\n    ");
        if (this.properties.showTransparentBackground) {
            this._forceTransparentBackground();
        }
    };
    GreetingWebPart.prototype._forceTransparentBackground = function () {
        var _this = this;
        var elementId = "greeting-".concat(this.context.instanceId);
        var element = document.getElementById(elementId);
        if (element) {
            element.style.setProperty('background', 'none', 'important');
            element.style.setProperty('background-color', 'transparent', 'important');
            var parent_1 = element.parentElement;
            var levels = 0;
            while (parent_1 && levels < 5) { // Increased levels for full-width sections
                parent_1.style.setProperty('background', 'none', 'important');
                parent_1.style.setProperty('background-color', 'transparent', 'important');
                // Target SharePoint specific canvas elements
                if (parent_1.classList.contains('CanvasComponent') ||
                    parent_1.classList.contains('CanvasZone') ||
                    parent_1.classList.contains('SPCanvas') ||
                    parent_1.dataset.spCanvascontrol) {
                    parent_1.style.setProperty('background', 'transparent', 'important');
                    parent_1.style.setProperty('background-color', 'transparent', 'important');
                    parent_1.style.setProperty('width', '100%', 'important');
                }
                parent_1 = parent_1.parentElement;
                levels++;
            }
        }
        setTimeout(function () { return _this._forceTransparentBackground(); }, 500);
    };
    Object.defineProperty(GreetingWebPart.prototype, "dataVersion", {
        get: function () {
            return Version.parse('1.0');
        },
        enumerable: false,
        configurable: true
    });
    GreetingWebPart.prototype.getPropertyPaneConfiguration = function () {
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
    };
    return GreetingWebPart;
}(BaseClientSideWebPart));
export default GreetingWebPart;
//# sourceMappingURL=GreetingWebPart.js.map