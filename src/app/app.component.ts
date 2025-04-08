import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  reimbursement = {
    date: '',
    amount: null,
    description: ''
  };

  selectedFile: File | null = null;
  reimbursements: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchReimbursements();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (!this.selectedFile) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('date', this.reimbursement.date);
    formData.append('amount', this.reimbursement.amount || '');
    formData.append('description', this.reimbursement.description);
    formData.append('receipt', this.selectedFile);

    this.http.post('http://localhost:5217/api/reimbursement', formData).subscribe({
      next: response => {
        alert('Reimbursement submitted successfully!');
        this.clearForm();
        this.fetchReimbursements();
      },
      error: error => {
        alert('Failed to submit reimbursement');
        console.error(error);
      }
    });
  }

  isImage(fileName: string): boolean {
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ['png', 'jpg', 'jpeg'].includes(ext || '');
  }

  fetchReimbursements() {
    this.http.get<any[]>('http://localhost:5217/api/reimbursement')
      .subscribe(data => {
        this.reimbursements = data;
      }, error => {
        console.error('Failed to fetch reimbursements', error);
      });
  }

  clearForm() {
    this.reimbursement = { date: '', amount: null, description: '' };
    this.selectedFile = null;
    const fileInput = document.getElementById('receipt') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
