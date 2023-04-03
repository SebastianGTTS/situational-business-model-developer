import { Component, OnInit } from '@angular/core';
import { DevelopmentMethodService } from '../../../development-process-registry/development-method/development-method.service';
import { DevelopmentMethodLoaderService } from '../../shared/development-method-loader.service';
import { DevelopmentMethod } from '../../../development-process-registry/development-method/development-method';
import { DevelopmentMethodTutorialService } from './development-method-tutorial.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-development-method',
  templateUrl: './development-method.component.html',
  styleUrls: ['./development-method.component.css'],
  providers: [DevelopmentMethodLoaderService, DevelopmentMethodTutorialService],
})
export class DevelopmentMethodComponent implements OnInit {
  correctlyDefined = true;

  constructor(
    private developmentMethodLoaderService: DevelopmentMethodLoaderService,
    private developmentMethodService: DevelopmentMethodService,
    private developmentMethodTutorialService: DevelopmentMethodTutorialService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    void this.developmentMethodTutorialService.init(
      this.route.snapshot.queryParamMap.get('created') === 'true',
      this.route.snapshot.queryParamMap.get('tutorial') === 'true'
    );
    this.developmentMethodLoaderService.loaded.subscribe(() => {
      if (this.developmentMethod != null) {
        this.correctlyDefined =
          this.developmentMethodService.isCorrectlyDefined(
            this.developmentMethod
          );
      } else {
        this.correctlyDefined = true;
      }
    });
  }

  get developmentMethod(): DevelopmentMethod | undefined {
    return this.developmentMethodLoaderService.developmentMethod;
  }
}
