import { Component } from '@angular/core';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent {
  activeSection = 'overview';

  sections = [
    { id: 'overview',        label: 'Overview',          icon: 'details'         },
    { id: 'getting-started', label: 'Getting Started',   icon: 'step-forward-2'  },
    { id: 'filters',         label: 'Filters & Search',  icon: 'search'          },
    { id: 'capabilities',    label: 'Capability Badges', icon: 'tag'             },
    { id: 'model-detail',    label: 'Model Detail Page', icon: 'info-standard'   },
    { id: 'providers',       label: 'Providers',         icon: 'organization'    },
    { id: 'use-cases',       label: 'Use Cases',         icon: 'star'            },
    { id: 'faq',             label: 'FAQ',               icon: 'help'            },
  ];

  scrollTo(id: string): void {
    this.activeSection = id;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
