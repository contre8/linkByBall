// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
// import { config } from './app/app.config.server';

// const bootstrap = () => bootstrapApplication(AppComponent, config);

// export default bootstrap;

import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppServerModule } from './app/app.server.module';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { renderModule } from '@angular/platform-server';

if (environment.production) {
  enableProdMode();
}

export { AppServerModule, ngExpressEngine, renderModule };

// Agrega una exportación por defecto, si es necesario
export default AppServerModule;
