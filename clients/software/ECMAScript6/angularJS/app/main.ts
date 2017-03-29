// 引入启动器
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// 引入入口文件
import { AppModule } from './app.module';

// 启动应用
const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);