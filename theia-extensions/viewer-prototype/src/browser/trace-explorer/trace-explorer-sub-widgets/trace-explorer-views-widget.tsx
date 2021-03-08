import { injectable, postConstruct } from 'inversify';
import { ReactWidget, Widget, Message } from '@theia/core/lib/browser';
import * as React from 'react';
import { ReactAvailableViewsWidget} from '@trace-viewer/react-components/lib/trace-explorer/trace-explorer-views-widget';

@injectable()
export class TraceExplorerViewsWidget extends ReactWidget {
    static ID = 'trace-explorer-views-widget';
    static LABEL = 'Available Views';
    @postConstruct()
    init(): void {
        this.id = TraceExplorerViewsWidget.ID;
        this.title.label = TraceExplorerViewsWidget.LABEL;
        this.update();
    }

    dispose(): void {
        super.dispose();
    }

    render(): React.ReactNode {
        return (<div>
            { <ReactAvailableViewsWidget
                id={this.id}
                title={this.title.label}
            ></ReactAvailableViewsWidget>
            }
        </div>);
    }

    protected onResize(msg: Widget.ResizeMessage): void {
        super.onResize(msg);
        this.update();
    }

    protected onAfterShow(msg: Message): void {
        super.onAfterShow(msg);
        this.update();
    }
}
