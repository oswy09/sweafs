<script setup lang="ts">
import { reactive, ref } from 'vue';

type Field = {
  name: string;
  label: string;
  type: 'text' | 'tel' | 'email' | 'textarea';
  placeholder: string;
  full?: boolean;
  required?: boolean;
};

const props = defineProps<{
  fields: Field[];
  submitLabel: string;
  successMessage: string;
  web3forms: {
    accessKey: string;
    subject?: string;
    fromName?: string;
  };
}>();

const submitted = ref(false);
const submitting = ref(false);
const statusMessage = ref('');
const statusType = ref<'success' | 'error' | ''>('');
const formEl = ref<HTMLFormElement | null>(null);
const fieldErrors = reactive<Record<string, string>>({});
const touchedFields = reactive<Record<string, boolean>>({});

const form = reactive<Record<string, string>>(
  Object.fromEntries(props.fields.map((field) => [field.name, ''])) as Record<string, string>,
);

const validateField = (field: Field, value: string): string => {
  const trimmed = value.trim();

  if (field.required && !trimmed) {
    return 'Detta fält är obligatoriskt.';
  }

  if (!trimmed) {
    return '';
  }

  if (field.type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return 'Ange en giltig e-postadress.';
    }
  }

  if (field.type === 'tel') {
    const phoneRegex = /^[0-9]{7,15}$/;
    if (!phoneRegex.test(trimmed)) {
      return 'Ange endast siffror, 7 till 15 tecken.';
    }
  }

  return '';
};

const validateAllFields = () => {
  let hasErrors = false;
  props.fields.forEach((field) => {
    const message = validateField(field, form[field.name] || '');
    fieldErrors[field.name] = message;
    touchedFields[field.name] = true;
    if (message) {
      hasErrors = true;
    }
  });
  return !hasErrors;
};

const handleFieldInput = (field: Field, event: Event) => {
  touchedFields[field.name] = true;

  if (field.type !== 'tel') return;

  const target = event.target as HTMLInputElement | null;
  if (!target) return;

  const numericValue = target.value.replace(/\D+/g, '');
  target.value = numericValue;
  form[field.name] = numericValue;
  fieldErrors[field.name] = validateField(field, numericValue);
};

const handleFieldBlur = (field: Field) => {
  touchedFields[field.name] = true;
  fieldErrors[field.name] = validateField(field, form[field.name] || '');
};

const handleSubmit = async (event: Event) => {
  event.preventDefault();
  if (submitting.value) return;

  const currentForm = formEl.value || (event.currentTarget as HTMLFormElement | null);
  if (!currentForm) return;

  if (!validateAllFields()) {
    return;
  }

  submitting.value = true;
  submitted.value = false;
  statusMessage.value = '';
  statusType.value = '';

  try {
    const payload = new FormData();
    const userMessage = form.message?.trim() || '';
    const nonce = Math.random().toString(36).slice(2, 10);
    const normalizedMessage = userMessage.length >= 20
      ? userMessage
      : `Ny kontaktforfragan fran webbplatsen. Kundens meddelande: ${userMessage || 'Ingen fri text angavs'}. Kontaktuppgifter: Namn ${form.name || '-'}, Telefon ${form.phone || '-'}, E-post ${form.email || '-'}, Adress ${form.address || '-'}. Skickad: ${new Date().toLocaleString('sv-SE')}. Referens: ${nonce}.`;

    payload.append('access_key', props.web3forms.accessKey);
    payload.append('name', form.name || 'Kund');
    payload.append('email', form.email || '');
    payload.append('message', normalizedMessage);
    payload.append('botcheck', '');

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: payload,
    });

    const result = await response.json().catch(() => ({ success: false, message: 'Invalid response' }));

    if (!response.ok || !result.success) {
      throw new Error(result?.message || 'Form submission failed');
    }

    currentForm.reset();
    Object.keys(form).forEach((key) => {
      form[key] = '';
      fieldErrors[key] = '';
      touchedFields[key] = false;
    });
    submitted.value = true;
    statusMessage.value = props.successMessage;
    statusType.value = 'success';
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Nagot gick fel vid skickning. Prova igen om en stund.';
    if (message.toLowerCase().includes('marked as spam')) {
      statusMessage.value = 'Meddelandet blockerades som spam. Kontrollera att din produktionsdomän är tillagd i Web3Forms och försök igen med en mer detaljerad text.';
    } else {
      statusMessage.value = `Fel vid skickning: ${message}`;
    }
    statusType.value = 'error';
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <form ref="formEl" class="contact-form" @submit="handleSubmit">
    <div class="form-grid">
      <div v-for="field in fields" :key="field.name" :class="['form-field', { full: field.full }]">
        <label :for="field.name">
          {{ field.label }}
          <span v-if="field.required" class="required-indicator" aria-hidden="true">*</span>
          <span v-if="field.required" class="required-text">obligatoriskt</span>
        </label>
        <textarea
          v-if="field.type === 'textarea'"
          :id="field.name"
          :name="field.name"
          :aria-label="field.label"
          v-model="form[field.name]"
          :placeholder="field.placeholder"
          :required="field.required ?? false"
          @blur="handleFieldBlur(field)"
        ></textarea>
        <input
          v-else
          :id="field.name"
          :name="field.name"
          :aria-label="field.label"
          v-model="form[field.name]"
          :type="field.type"
          :placeholder="field.placeholder"
          :required="field.required ?? false"
          :inputmode="field.type === 'tel' ? 'numeric' : undefined"
          :autocomplete="field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'on'"
          :pattern="field.type === 'tel' ? '[0-9]{7,15}' : undefined"
          :title="field.type === 'tel' ? 'Ange endast siffror, 7 till 15 tecken.' : undefined"
          @input="handleFieldInput(field, $event)"
          @blur="handleFieldBlur(field)"
        />
        <p v-if="touchedFields[field.name] && fieldErrors[field.name]" class="field-error" role="alert">
          {{ fieldErrors[field.name] }}
        </p>
      </div>
    </div>

    <p class="form-required-note"><span aria-hidden="true">*</span> obligatoriska fält</p>

    <input type="hidden" name="botcheck" value="" />

    <p
      v-if="statusMessage"
      :class="['form-feedback', statusType === 'success' ? 'form-feedback-success' : 'form-feedback-error']"
      aria-live="polite"
    >
      {{ statusMessage }}
    </p>

    <button class="btn-submit" type="submit" :disabled="submitting">
      {{ submitting ? 'Skickar...' : submitLabel }}
    </button>
  </form>
</template>