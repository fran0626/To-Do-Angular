import { Component, signal, computed, effect, inject, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskModel } from '../models/task.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {

  tasks = signal<TaskModel[]>([]);

  nextId: number = this.tasks().length + 1;

  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required
    ]
  });

  filter = signal<'all' | 'completed' | 'pending'>('all');

  tasksByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();
    switch (filter) {
      case 'all':
        return tasks;
      case 'completed':
      return tasks.filter(task => task.completed);
      case 'pending':
        return tasks.filter(task => !task.completed);
      default:
        return tasks;
    }
  })

  injector = inject(Injector);

  ngOnInit() {
    const storage = localStorage.getItem('tasks');
    if (storage) {
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks);
    }
    this.trackTasks();
  }

  trackTasks() {
    // Se hace inyección de dependencias solo si no se usa el constructor
    effect(() => {
      const tasks = this.tasks();
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, { injector: this.injector });
  }


  changeHandler() {
    if (this.newTaskCtrl.valid) {
      const newTask = this.newTaskCtrl.value.trim();
      if (newTask !== ''){
        this.addNewTask(newTask);
        this.newTaskCtrl.setValue('');
      }
    }
  }

  addNewTask(title: string) {
    const newTask = {
      id: this.nextId++,
      title,
      completed: false
    }
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  deleteTask(index: number) {
    this.tasks.update((tasks) =>
      tasks.filter((task, position) =>
        position !== index));
  }

  updateTask(index: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            completed: !task.completed
          }
        }
        return task;
      })
    });
  }

  updateTaskEditingMode(index: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === index) {
          if(!task.completed){
            return {
              ...task,
              editing: true
            }
          }
          return task;
        }
        return {
          //El resto de tareas no se pueden editar
          ...task,
          editing: false
        };
      })
    });
  }

  updateTaskText(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            title: input.value,
            editing: false
          }
        }
        return task;
      })
    });
  }

  changeFilter(filter: 'all' | 'completed' | 'pending') {
    this.filter.set(filter);
  }

  deleteCompletedTasks(tasks: TaskModel[]) {
    this.tasks.update((tasks) =>
      tasks.filter((task) =>!task.completed));
  }
}
