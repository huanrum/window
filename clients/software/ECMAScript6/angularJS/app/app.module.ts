// zone 为异步任务提供hook支持，主要应用于提高脏检查效率和降低性能损耗
// reflect-metadata 为Decorator提供反应射API，注意:Decorator是ES6的提案
import 'zone.js/dist/zone';
import 'reflect-metadata';

// 引入NgModule装饰器
import { NgModule } from '@angular/core';

// 引入浏览器模块
import { BrowserModule } from '@angular/platform-browser';

// 引入组件AppComponent
import { AppComponent } from './app.component';

@NgModule({
    imports: [ BrowserModule ],
    declarations: [ AppComponent ],
    bootstrap: [ AppComponent ]
})

export class AppModule {}