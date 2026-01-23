# Data Model: Simple Homepage

**Feature**: 006-simple-homepage
**Date**: 2026-01-23

## Overview

This feature involves static content only - no database entities, API endpoints, or persistent state. The data model consists of TypeScript interfaces for component props.

## Component Interfaces

### FeatureCardProps

Defines the props for the reusable feature card component.

```typescript
interface FeatureCardProps {
  /** Icon component to display */
  icon: React.ReactNode;
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
}
```

### Feature Content Data

Static content for the four platform features.

```typescript
interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: IconVideo,
    title: "Live Stream Monitoring",
    description: "Monitor all active broadcast streams in real-time with a responsive grid layout."
  },
  {
    icon: IconUsers,
    title: "Broadcaster Management",
    description: "Create and manage broadcaster profiles for your team members and devices."
  },
  {
    icon: IconKey,
    title: "Stream Key Authentication",
    description: "Generate secure stream keys to authenticate your broadcasting software."
  },
  {
    icon: IconBroadcast,
    title: "Multi-Protocol Support",
    description: "Stream via RTMP and view via HLS or WebRTC for ultra-low latency."
  }
];
```

## State Management

**None required** - The homepage is a pure Server Component with static content.

## Data Flow

```
┌─────────────────────┐
│   Server Render     │
│   (Static Content)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Homepage Layout   │
│   - Header          │
│   - Footer          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Homepage Page     │
│   - Hero Section    │
│   - Features Grid   │
│   - CTA Button      │
└─────────────────────┘
```

## No Database Entities

This feature does not introduce any database tables or persistent storage. All content is hardcoded in the component files.
