import { Component, OnInit, Input } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NewsService } from '../../services/news.service';
import { AllNews } from 'src/app/models/AllNews';
import { News } from 'src/app/models/News';
import { Auth } from 'src/app/models/Auth';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit {
  @Input() category: string;

  allNews: AllNews;
  news: Array<News>;
  user: Auth;
  savedNews: Array<string>;

  constructor(
    private allNewsService: NewsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    switch (this.category) {
      case 'allNews':
        this.getAllNews();
        break;

      case 'business':
        this.getBusinessNews();
        break;

      case 'sports':
        this.getSportsNews();
        break;

      case 'entertainment':
        this.getEntertainmentNews();
        break;

      case 'mostViewed':
        this.getMostViewedNews();
        break;

      default:
        break;
    }

    this.user = JSON.parse(localStorage.getItem('auth'));
    this.getSavedNews();
  }

  savedSnackBar() {
    this.snackBar.open('STORY SAVED', 'OK', {
      duration: 2000
    });
  }

  getAllNews() {
    this.allNewsService.getAllNews().subscribe(response => {
      this.allNews = response;
      this.news = this.allNews.body;
    });
  }

  getBusinessNews() {
    this.allNewsService.getBusinessNews().subscribe(response => {
      this.allNews = response;
      this.news = this.allNews.body;
    });
  }

  getSportsNews() {
    this.allNewsService.getSportsNews().subscribe(response => {
      this.allNews = response;
      this.news = this.allNews.body;
    });
  }

  getEntertainmentNews() {
    this.allNewsService.getEntertainmentNews().subscribe(response => {
      this.allNews = response;
      this.news = this.allNews.body;
    });
  }

  getMostViewedNews() {
    this.allNewsService.getMostViewedNews().subscribe(response => {
      this.allNews = response;
      this.news = this.allNews.body;
    });
  }

  openNews(URL: string, id: string) {
    window.open(URL, '_blank');
    this.allNewsService.increamentClickCount(id).subscribe();
  }

  saveNews(id: string) {
    if (!this.user || !this.user.email) {
      this.openDialog();
    } else {
      const payload = {
        token: this.user.token,
        mongoID: id
      };
      this.allNewsService.saveNews(payload).subscribe(response => {
        if (response.status === 'success') {
          this.savedSnackBar();
          this.savedNews.push(id);
        }
      });
    }
  }

  getSavedNews() {
    if (this.user && this.user.token) {
      const payload = {
        token: this.user.token
      };
      this.allNewsService.getSavedNews(payload).subscribe(response => {
        if (response.status === 'success') {
          this.savedNews = response.body;
        }
      });
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(() => {
      window.location.reload();
    });
  }
}
