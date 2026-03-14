import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CatApiService, CatPayload } from '../../../../core/services/cat-api.service';
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
  // All inject() — no constructor needed
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(CatApiService);
  private readonly dialogRef = inject(MatDialogRef<CreateCatDialog, boolean>);

  // Typed properly — Cat | null, no any
  readonly data = inject<Cat | null>(MAT_DIALOG_DATA);

  // Computed title based on mode
  get isEditMode(): boolean {
    return !!this.data?.id;
  }

  readonly form = this.fb.group({
    name: ['', Validators.required],
    age: ['', Validators.required],
    description: ['', Validators.required],
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
    if (this.form.invalid) return;

    const payload: CatPayload = {
      name: this.form.value.name!,
      age: this.form.value.age!,
      description: this.form.value.description!,
    };

    if (this.isEditMode) {
      this.api.updateCat(this.data!.id!, payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.dialogRef.close(false),
      });
    } else {
      this.api.createCat(payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => this.dialogRef.close(false),
      });
    }
  }
}
