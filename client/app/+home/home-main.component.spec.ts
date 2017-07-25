import {inject, TestBed} from "@angular/core/testing";
import {BaseRequestOptions, ConnectionBackend, Http} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
// import {AppState} from "../app.service";
import {HomeMainComponent} from "./home-main.component";
import {Title} from "./title";


describe('Home', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      BaseRequestOptions, MockBackend, {
        provide: Http,
        useFactory: function useFactory (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
          return new Http(backend, defaultOptions);
        },
        deps: [MockBackend, BaseRequestOptions]
      }, Title, HomeMainComponent
    ]
  }));

  it('should have default data', inject([HomeMainComponent], (home: HomeMainComponent) => {
    return expect(home.localState).toEqual({value: ''}); //.eventually.to.equal({value: ''});
  }));

  it('should have a title', inject([HomeMainComponent], (home: HomeMainComponent) => {
    expect(!!home.title)
      .toEqual(true);
  }));

  it('should log ngOnInit', inject([HomeMainComponent], (home: HomeMainComponent) => {
    spyOn(console, 'log');
    expect(console.log)
      .not
      .toHaveBeenCalled();

    home.ngOnInit();
    expect(console.log)
      .toHaveBeenCalled();
  }));

});
