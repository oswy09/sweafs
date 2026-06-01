import { defineConfig } from 'tinacms';

const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.HEAD ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.GITHUB_REF_NAME ||
  'main';

export default defineConfig({
  branch,
  clientId: process.env.TINA_CLIENT_ID || '',
  token: process.env.TINA_TOKEN || '',
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: '',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      {
        name: 'site',
        label: 'Site Content',
        path: 'content',
        format: 'json',
        match: {
          include: 'site',
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: 'object',
            name: 'meta',
            label: 'Meta',
            fields: [
              { type: 'string', name: 'title', label: 'Title' },
              { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
            ],
          },
          {
            type: 'object',
            name: 'logo',
            label: 'Logo',
            fields: [
              { type: 'string', name: 'label', label: 'Label' },
              { type: 'string', name: 'accent', label: 'Accent' },
            ],
          },
          {
            type: 'object',
            name: 'navigation',
            label: 'Navigation',
            list: true,
            fields: [
              { type: 'string', name: 'label', label: 'Label' },
              { type: 'string', name: 'href', label: 'Href' },
              { type: 'boolean', name: 'cta', label: 'CTA' },
            ],
          },
          {
            type: 'object',
            name: 'topContact',
            label: 'Top Contact',
            fields: [
              { type: 'string', name: 'phoneLabel', label: 'Phone Label' },
              { type: 'string', name: 'phoneHref', label: 'Phone Href' },
              { type: 'string', name: 'emailLabel', label: 'Email Label' },
              { type: 'string', name: 'emailHref', label: 'Email Href' },
              { type: 'string', name: 'whatsappLabel', label: 'WhatsApp Label' },
              { type: 'string', name: 'whatsappHref', label: 'WhatsApp Href' },
            ],
          },
          {
            type: 'object',
            name: 'hero',
            label: 'Hero',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Eyebrow' },
              { type: 'string', name: 'title', label: 'Title' },
              { type: 'string', name: 'subtitle', label: 'Subtitle', ui: { component: 'textarea' } },
              { type: 'string', name: 'primaryCta', label: 'Primary CTA' },
              { type: 'string', name: 'secondaryCta', label: 'Secondary CTA' },
              { type: 'image', name: 'image', label: 'Hero Image' },
            ],
          },
          {
            type: 'object',
            name: 'benefits',
            label: 'Benefits Band',
            list: true,
            fields: [
              { type: 'string', name: 'title', label: 'Title' },
              { type: 'string', name: 'body', label: 'Body', ui: { component: 'textarea' } },
            ],
          },
          {
            type: 'object',
            name: 'servicesSection',
            label: 'Services Section',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Eyebrow' },
              { type: 'string', name: 'title', label: 'Title' },
              { type: 'string', name: 'lead', label: 'Lead', ui: { component: 'textarea' } },
            ],
          },
          {
            type: 'object',
            name: 'services',
            label: 'Services',
            list: true,
            fields: [
              { type: 'string', name: 'title', label: 'Title' },
              { type: 'string', name: 'body', label: 'Body', ui: { component: 'textarea' } },
              { type: 'string', name: 'cta', label: 'CTA' },
              { type: 'boolean', name: 'reverse', label: 'Reverse Layout' },
              {
                type: 'object',
                name: 'before',
                label: 'Before Image',
                fields: [
                  { type: 'image', name: 'src', label: 'Source' },
                  { type: 'string', name: 'alt', label: 'Alt' },
                  { type: 'string', name: 'label', label: 'Label' },
                  { type: 'string', name: 'objectPosition', label: 'Object Position' },
                ],
              },
              {
                type: 'object',
                name: 'after',
                label: 'After Image',
                fields: [
                  { type: 'image', name: 'src', label: 'Source' },
                  { type: 'string', name: 'alt', label: 'Alt' },
                  { type: 'string', name: 'label', label: 'Label' },
                  { type: 'string', name: 'objectPosition', label: 'Object Position' },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'why',
            label: 'Why Section',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Eyebrow' },
              { type: 'string', name: 'title', label: 'Title' },
              { type: 'string', name: 'lead', label: 'Lead', ui: { component: 'textarea' } },
              {
                type: 'object',
                name: 'items',
                label: 'Items',
                list: true,
                fields: [
                  { type: 'string', name: 'icon', label: 'Icon' },
                  { type: 'string', name: 'title', label: 'Title' },
                  { type: 'string', name: 'body', label: 'Body', ui: { component: 'textarea' } },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'contact',
            label: 'Contact Section',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Eyebrow' },
              { type: 'string', name: 'title', label: 'Title' },
              { type: 'string', name: 'lead', label: 'Lead', ui: { component: 'textarea' } },
              {
                type: 'object',
                name: 'fields',
                label: 'Form Fields',
                list: true,
                fields: [
                  { type: 'string', name: 'name', label: 'Name' },
                  { type: 'string', name: 'label', label: 'Label' },
                  {
                    type: 'string',
                    name: 'type',
                    label: 'Type',
                    options: ['text', 'tel', 'email', 'textarea'],
                  },
                  { type: 'string', name: 'placeholder', label: 'Placeholder' },
                  { type: 'boolean', name: 'full', label: 'Full Width' },
                  { type: 'boolean', name: 'required', label: 'Required' },
                ],
              },
              { type: 'string', name: 'submitLabel', label: 'Submit Label' },
              { type: 'string', name: 'successMessage', label: 'Success Message' },
              {
                type: 'object',
                name: 'web3forms',
                label: 'Web3Forms',
                fields: [
                  { type: 'string', name: 'accessKey', label: 'Access Key' },
                  { type: 'string', name: 'subject', label: 'Email Subject' },
                  { type: 'string', name: 'fromName', label: 'From Name' },
                  { type: 'string', name: 'ccEmail', label: 'CC Email' },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'footer',
            label: 'Footer',
            fields: [
              {
                type: 'object',
                name: 'brand',
                label: 'Brand',
                fields: [
                  { type: 'string', name: 'label', label: 'Label' },
                  { type: 'string', name: 'accent', label: 'Accent' },
                ],
              },
              { type: 'string', name: 'copy', label: 'Copy', ui: { component: 'textarea' } },
              { type: 'string', name: 'phoneLabel', label: 'Phone Label' },
              { type: 'string', name: 'phoneHref', label: 'Phone Href' },
              { type: 'string', name: 'emailLabel', label: 'Email Label' },
              { type: 'string', name: 'emailHref', label: 'Email Href' },
              { type: 'string', name: 'whatsappLabel', label: 'WhatsApp Label' },
              { type: 'string', name: 'whatsappHref', label: 'WhatsApp Href' },
            ],
          },
        ],
      },
    ],
  },
});
