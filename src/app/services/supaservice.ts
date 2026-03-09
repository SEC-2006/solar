import { HttpClient, HttpHeaders, httpResource } from '@angular/common/http';
import {computed, inject, Injectable, Resource, resource, signal, Signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, from, interval, map, Observable, Subscriber, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Planta } from '../plantes/planta';
import { AuthChangeEvent, createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { Registre } from '../plantes/registre';

@Injectable({
  providedIn: 'root',
})
export class Supaservice {
  private http = inject(HttpClient);

  private supabase: SupabaseClient;

  plantesSubject = new BehaviorSubject<Planta[]>([]);

  setSearchString(searchString: string) {
    this.subjectSearchString.next(searchString);
  }
  subjectSearchString = new BehaviorSubject('');

  loggedSubject = new BehaviorSubject<Session | null>(null)

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.authChangesObservable().subscribe((session)=>{
      this.loggedSubject.next(session.session)
    });
    this.subjectSearchString
      .pipe(
        map(s => Boolean(s) ? s : ''),
        debounceTime(500),
        distinctUntilChanged(),
        map((s) => s.toLowerCase()),
        //tap(s => console.log("pipe",s))
      )
      .subscribe(async (searchString) => {
        const plantes = await this.searchPlantesSupabase(searchString);
        this.plantesSubject.next(plantes);
        //console.log(plantes);
        //this.plantesSearchSignal.set(searchString);
      });
  }

  // Método para obtener datos de la tabla 'plantes'

  async getPlantesSupabase(): Promise<Planta[]> {
    const { data, error } = await this.supabase
      .from('plantes')
      .select('*');
    if (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
    return data;
  }

  async searchPlantesSupabase(searchString: string): Promise<Planta[]> {
    const { data, error } = await this.supabase
      .from('plantes')
      .select('*')
      .ilike('nom',`%${searchString}%`);
    if (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
    return data;
  }

  async getPlantaSupabaseById(id: number): Promise<Planta | null> {
    const { data, error } = await this.supabase.from('plantes').select('*').eq('id', id); // .single();
    if (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
    return data && data.length > 0 ? data[0] : null;
  }

  plantaId: WritableSignal<number | null> = signal(null);

  getPlantaById(id: number) {
    this.plantaId.set(id);
    return this.plantaResourceById;
  }

  plantaResourceById = resource({
    params: () => ({ id: this.plantaId() }),
    loader: async ({ params }) => {
      if (params.id === null) return null;
      return await this.getPlantaSupabaseById(params.id!);
    },
  });

  plantaIdSignal = computed(() =>
    this.plantaResourceById.hasValue() ? this.plantaResourceById.value() : null,
  );

  getPlantesObservable(): Observable<Planta[]> {
    return from(this.getPlantesSupabase());
  }

  getEcho(data: string){
    return data;
  }

  getPlantes(): Observable<Planta[]> {
    const result = this.http.get<Planta[]>(environment.supabaseUrl + '/rest/v1/plantes?select=*', {
      headers: new HttpHeaders({
        apikey: environment.supabaseKey,
        Authorization: `Bearer ${environment.supabaseKey}`,
      }),
    });
    return result;
  }

  getPlantesSignal() {
    return httpResource<Planta[]>(() => ({
      url: `${environment.supabaseUrl}/rest/v1/plantes?select=*`,

      headers: {
        apikey: environment.supabaseKey,
        Authorization: `Bearer ${environment.supabaseKey}`,
      },
    }));
  }

  async insertRegistesSupabase(registes: Registre[]): Promise<void> {
    const { data, error } = await this.supabase.from('registres').insert(registes);
    if (error) {
      console.error('Error inserting data:', error);
      throw error;
    }
    // console.log('Data inserted successfully:', data);
  }

  async getRegistesSupabase(plantaId: number): Promise<Registre[]> {
    const { data, error } = await this.supabase
      .from('registres')
      .select('*')
      .eq('planta', plantaId)
      .limit(288)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
    return data;
  }

  async login(loginData: {email: string, password: string}) {
    let { data, error } = await this.supabase.auth.signInWithPassword(loginData);
    if(error) {
      console.error('Error inserting data', error);
      throw error;
    }
    return data;
  }

  async register(loginData: {email: string, password: string}) {
    let { data, error } = await this.supabase.auth.signUp(loginData);
    if(error) {
      console.error('Error inserting data', error);
      throw error;
    }
    return data;
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  authChangesObservable(): Observable<{event: AuthChangeEvent; session: Session | null}> {
    return new Observable((subscriber) => {
      const {data: authListener} = this.supabase.auth.onAuthStateChange(
        (event: AuthChangeEvent, session: Session | null) => {
          subscriber.next({event, session})
        }
      );

      return()=>{
        authListener.subscription.unsubscribe();
      };
    });
  }

  async logout() {
    let {error} = await this.supabase.auth.signOut();
  }

  observableTime = new Observable((suscriber) => {
    let i=0;
    setInterval(() => {
      suscriber.next(i);
      i++;
    }, 1000)
  })

  observableTimeRxJS = interval(1000)

  async createPlanta(dataPlanta: Planta){
    const {created_at, id, ...dataPlantaClean} = dataPlanta;
    const { data, error } = await this.supabase.from('plantes').insert(dataPlantaClean);
    if (error) {
      console.error('Error inserting data:', error);
      throw error;
    }
    const plantes = await this.searchPlantesSupabase(this.subjectSearchString.value);
    this.plantesSubject.next(plantes);
    return data;
  }

  async updatePlanta(dataPlanta: Planta) {
    const {created_at, id, ...dataPlantaClean} = dataPlanta;
    const { data, error } = await this.supabase.from('plantes').update(dataPlantaClean).eq('id', id).select();;
    
    console.log('update result → data:', data, '| error:', error); // ← añade esto
    
    if (error) {
      console.error('Error updating data:', error);
      throw error;
    }
    const plantes = await this.searchPlantesSupabase(this.subjectSearchString.value);
    this.plantesSubject.next(plantes);
    return data;
  }
  
}
