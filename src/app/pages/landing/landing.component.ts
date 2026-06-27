import { Component, AfterViewInit, OnDestroy, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  standalone: true,
  imports: [RouterLink, CommonModule]
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  private observer: IntersectionObserver | null = null;
  isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (!isPlatformBrowser(this.platformId)) return;
    const glow = document.querySelector('.gradient-mesh') as HTMLElement;
    if (glow) {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      glow.style.background = `radial-gradient(at ${x}% ${y}%, rgba(197, 246, 237, 0.1) 0%, transparent 50%),
                               radial-gradient(at 100% 100%, rgba(0, 0, 0, 1) 0%, transparent 50%)`;
    }
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const observerOptions = {
      threshold: 0.1,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    const cards = document.querySelectorAll('.glass-card');
    cards.forEach((card) => {
      card.classList.add(
        'transition-all',
        'duration-700',
        'opacity-0',
        'translate-y-10'
      );
      this.observer?.observe(card);
    });
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
