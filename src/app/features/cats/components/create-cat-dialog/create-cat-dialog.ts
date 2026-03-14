import { Component, OnInit, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CatPayload } from '../../../../core/services/cat-api.service';
import { CatsStore } from '../../store/cats.store';
import { Cat } from '../../../../core/models/cat.model';

@Component({
  selector: 'app-create-cat-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './create-cat-dialog.html',
  styleUrl: './create-cat-dialog.scss',
})
export class CreateCatDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(CatsStore); //  Use store, not API directly
  private readonly dialogRef = inject(MatDialogRef<CreateCatDialog, boolean>);
  private readonly snackBar = inject(MatSnackBar);
  readonly data = inject<Cat | null>(MAT_DIALOG_DATA);

  readonly submitting = signal<boolean>(false);

  get isEditMode(): boolean {
    return !!this.data?.id;
  }

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
    age: [
      '',
      [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1), Validators.max(30)],
    ],
    description: ['', [Validators.required, Validators.minLength(2)]],
  });

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue({
        name: this.data.name,
        age: this.data.age,
        description: this.data.description,
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const payload: CatPayload = {
      name: this.form.value.name!,
      age: this.form.value.age!,
      description: this.form.value.description!,
    };

    if (this.isEditMode) {
      //  Call store.updateCat — updates signal immediately
      this.store.updateCat(this.data!.id!, payload);
      this.submitting.set(false);
      this.dialogRef.close(true);
      this.snackBar.open(` "${payload.name}" updated!`, 'Close', {
        duration: 2000,
        panelClass: 'snack-success',
      });
    } else {
      //  Call store.createCat — adds to signal immediately
      this.store.createCat(payload);
      this.submitting.set(false);
      this.dialogRef.close(true);
      this.snackBar.open(` "${payload.name}" added!`, 'Close', {
        duration: 2000,
        panelClass: 'snack-success',
      });
    }
  }
}
