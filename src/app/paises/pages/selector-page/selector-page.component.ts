import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
import { Pais, PaisSmall } from '../../interfaces/paises.interface';
import { PaisesServiceService } from '../../services/paises-service.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
})
export class SelectorPageComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    region: ['', [Validators.required]],
    pais: ['', [Validators.required]],
    frontera: ['', [Validators.required]],
  });

  //llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: PaisSmall[] = [];
  dataFonteras: string[] = [];

  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private paisesService: PaisesServiceService
  ) {}

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    //cuando cambie la region
    // this.miFormulario.get('region')?.valueChanges.subscribe((region) => {
    //   console.log(region);
    //   this.paisesService.getPAisesPorRegion(region).subscribe((paises) => {
    //     this.paises = paises;
    //     console.log(paises);
    //   });
    // });
    this.miFormulario
      .get('region')
      ?.valueChanges.pipe(
        tap((region) => {
          console.log(region);
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
          // this.miFormulario.get('frontera')?.disable();
        }),
        switchMap((region) => this.paisesService.getPAisesPorRegion(region))
      )
      .subscribe((paises) => {
        this.paises = paises;
        this.cargando = false;
      });

    this.miFormulario
      .get('pais')
      ?.valueChanges.pipe(
        tap(() => {
          this.fronteras = [];
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
          // this.miFormulario.get('frontera')?.enable();
        }),
        switchMap((paisesCodigo) =>
          this.paisesService.getPaisesFronterizos(paisesCodigo)
        ),
        
        switchMap(pais => this.paisesService.getPaisPorCodigos(pais?.[0].borders!) )

      )
      .subscribe((paises) => {
        console.log(paises)
        this.fronteras = paises;
        this.cargando = false;

        // console.log(paisFrontera[0].length > 0);
        // this.fronteras = dataFrontera[0]?.borders
        // console.log( this.fronteras)
      });

    // this.miFormulario.get('pais')?.valueChanges.pipe(
    //   tap(pais => {
    //     console.log(pais)
    //   }),
    //   switchMap((pais) => this.paisesService.getPaisesFronterizos(pais))
    // ).subscribe((paisesFronterizos) => {
    //   this.frontera = paisesFronterizos;
    // });
  }

  guardar() {
    console.log(this.miFormulario.value);
    // this.miFormulario.controls?.valueChanges
  }

  // paisFrontera(event: string) {
  //  console.log(event)
  // }
}
