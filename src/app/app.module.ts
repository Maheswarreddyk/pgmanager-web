import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { AppComponent } from './app.component';
import { AuthModule } from './core/auth/auth.module';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { ToolbarModule } from 'primeng/toolbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { FileUploadModule } from 'primeng/fileupload';
import { EditorModule } from 'primeng/editor';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { TimelineModule } from 'primeng/timeline';
import { StepsModule } from 'primeng/steps';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenubarModule } from 'primeng/menubar';
import { MegaMenuModule } from 'primeng/megamenu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SlideMenuModule } from 'primeng/slidemenu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { DockModule } from 'primeng/dock';
import { TabMenuModule } from 'primeng/tabmenu';
import { PaginatorModule } from 'primeng/paginator';
import { DataViewModule } from 'primeng/dataview';
import { OrderListModule } from 'primeng/orderlist';
import { PickListModule } from 'primeng/picklist';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { TooltipModule } from 'primeng/tooltip';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { DividerModule } from 'primeng/divider';
import { SplitterModule } from 'primeng/splitter';
import { TerminalModule } from 'primeng/terminal';
import { VirtualScrollerModule } from 'primeng/virtualscroller';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    AuthModule,
    
    // PrimeNG Modules
    ButtonModule,
    CardModule,
    InputTextModule,
    ToastModule,
    ProgressSpinnerModule,
    DialogModule,
    SidebarModule,
    PanelMenuModule,
    TableModule,
    TagModule,
    ChartModule,
    ToolbarModule,
    InputNumberModule,
    DropdownModule,
    CalendarModule,
    InputMaskModule,
    InputSwitchModule,
    MultiSelectModule,
    RadioButtonModule,
    CheckboxModule,
    SliderModule,
    RatingModule,
    FileUploadModule,
    EditorModule,
    TreeModule,
    TreeTableModule,
    OrganizationChartModule,
    TimelineModule,
    StepsModule,
    BreadcrumbModule,
    MenubarModule,
    MegaMenuModule,
    PanelMenuModule,
    SlideMenuModule,
    TieredMenuModule,
    DockModule,
    TabMenuModule,
    PaginatorModule,
    DataViewModule,
    OrderListModule,
    PickListModule,
    VirtualScrollerModule,
    ScrollPanelModule,
    TabViewModule,
    AccordionModule,
    FieldsetModule,
    PanelModule,
    ScrollTopModule,
    TooltipModule,
    BlockUIModule,
    ProgressBarModule,
    SkeletonModule,
    BadgeModule,
    ChipModule,
    AvatarModule,
    AvatarGroupModule,
    DividerModule,
    SplitterModule,
    TerminalModule,
    VirtualScrollerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { } 