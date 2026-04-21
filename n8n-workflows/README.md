# RemitBuddy Blog Automation - n8n Workflow

## Overview

This n8n workflow automates the entire blog content creation process for RemitBuddy:

1. **News Collection** - Gathers latest exchange rate and remittance news
2. **Topic Selection** - AI-powered topic selection avoiding duplicates
3. **Blog Writing** - Creates SEO-optimized content in Korean and English
4. **Notion Upload** - Automatically uploads drafts to Notion databases

## Workflow Diagram

```
┌──────────────┐
│   Schedule   │ (Daily 9:00 AM KST)
│   Trigger    │
└──────┬───────┘
       │
       ├────────────────────────────┐
       ▼                            ▼
┌──────────────────┐    ┌──────────────────────┐
│ Claude: News     │    │ Read Notion Published│
│ Collector        │    │ (duplicate check)    │
└────────┬─────────┘    └──────────┬───────────┘
         │                         │
         └───────────┬─────────────┘
                     ▼
          ┌──────────────────┐
          │ Process Data     │
          └────────┬─────────┘
                   ▼
          ┌──────────────────┐
          │ Claude: Topic    │
          │ Selector         │
          └────────┬─────────┘
                   │
       ┌───────────┴───────────┐
       ▼                       ▼
┌──────────────┐       ┌──────────────┐
│ Claude: Blog │       │ Claude: Blog │
│ Writer KO    │       │ Writer EN    │
└──────┬───────┘       └──────┬───────┘
       ▼                       ▼
┌──────────────┐       ┌──────────────┐
│ Parse &      │       │ Parse &      │
│ Convert KO   │       │ Convert EN   │
└──────┬───────┘       └──────┬───────┘
       ▼                       ▼
┌──────────────┐       ┌──────────────┐
│ Notion       │       │ Notion       │
│ Upload KO    │       │ Upload EN    │
└──────┬───────┘       └──────┬───────┘
       │                       │
       └───────────┬───────────┘
                   ▼
          ┌──────────────────┐
          │ Compile Report   │
          └────────┬─────────┘
                   ▼
          ┌──────────────────┐
          │ Email Notify     │
          │ (Resend API)     │
          └──────────────────┘
```

## Setup Instructions

### 1. Environment Variables

Set these environment variables in Railway (or your n8n host):

| Variable | Description | Example |
|----------|-------------|---------|
| `ANTHROPIC_API_KEY` | Claude API key | `sk-ant-api03-...` |
| `NOTION_API_KEY` | Notion Integration token | `secret_...` |
| `NOTION_DB_KO` | Korean blog database ID | `abc123...` |
| `NOTION_DB_EN` | English blog database ID | `def456...` |
| `RESEND_API_KEY` | Resend email API key | `re_...` |

### 2. Notion Setup

#### Create Notion Integration

1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Name it "RemitBuddy Blog Automation"
4. Select the workspace
5. Copy the "Internal Integration Token"

#### Create Databases

The workflow uses the following database schema (already set up):

| Property | Type | Description |
|----------|------|-------------|
| Name | Title | Blog post title |
| Slug | Text | URL-friendly slug |
| Meta Title | Text | SEO meta title |
| Meta Description | Text | SEO meta description |
| Excerpt | Text | Short summary |
| Publish Date | Date | Publication date |
| Ready to Publish | Checkbox | Draft/Ready flag |
| Featured | Checkbox | Featured post flag |
| Image | Files | Featured image |
| Last Edited Time | Auto | Auto-updated |

#### Share with Integration

1. Open each database
2. Click "..." → "Add connections"
3. Select your integration

#### Get Database IDs

The database ID is in the URL:
```
https://www.notion.so/workspace/DATABASE_ID?v=...
```

### 3. Email Setup (Resend)

Email notifications are sent to `potensiainc@gmail.com`.

#### Create Resend Account

1. Sign up at https://resend.com (free tier: 3000 emails/month)
2. Verify your domain or use Resend's test domain
3. Go to API Keys: https://resend.com/api-keys
4. Create a new API key
5. Set `RESEND_API_KEY` environment variable

#### Change Email Recipient

To change the recipient email, edit the "Email Notification" node:
- Find `to: ['potensiainc@gmail.com']`
- Replace with your email address

### 4. Import Workflow

1. Open n8n
2. Go to Workflows → Import from File
3. Select `remitbuddy-blog-automation.json`
4. Update credential references if needed

### 5. Test Run

1. Click "Execute Workflow" manually
2. Check each node's output
3. Verify Notion pages are created

## Cost Estimate

| Item | Monthly Cost |
|------|-------------|
| Claude API (~120 calls/month) | ~$15-25 |
| n8n (Railway Hobby) | ~$5 |
| Notion | Free |
| **Total** | **~$20-30/month** |

## Troubleshooting

### Claude API Errors

- Check API key is valid
- Ensure sufficient credits
- Check rate limits

### Notion Upload Fails

- Verify database IDs are correct
- Check integration has access to databases
- Ensure property names match exactly

### No Topics Generated

- Check News Collector is returning data
- Verify published slugs aren't blocking all topics
- Review Claude response in node output

## Customization

### Change Schedule

Edit the Schedule Trigger node:
- Current: Every day at 9:00 AM KST
- Cron: `0 9 * * *`

### Add More Languages

1. Duplicate "Claude: Blog Writer EN" node
2. Modify system prompt for new language
3. Create new Notion database
4. Add new upload node

### Change Email Settings

1. Edit the "Email Notification" node in n8n
2. Change `to: ['potensiainc@gmail.com']` to your email
3. Optionally change `from:` if you have your own domain verified in Resend

## Files

- `remitbuddy-blog-automation.json` - Main workflow
- `README.md` - This documentation
- `.env.example` - Environment variables template
