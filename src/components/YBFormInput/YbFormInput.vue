<template>
  <div>
    <label :class="labelClass" class="w-100 text-left">
      <fas icon="asterisk" class="text-danger pb-1" style="font-size: 13px" v-if="required" />
      {{ title }}
      <br />
      <b-form-input
        v-if="!useSlot"
        :class="inputClass"
        :placeholder="placeholder"
        :type="type"
        :value="value"
        :required="required"
        :disabled="disabled"
        @input="$emit('input', $event)"
      />
      <slot v-else></slot> </label
    ><br />
  </div>
</template>
<script>
export default {
  name: "YBFormInput",
  data() {
    return {};
  },
  props: {
    inputClass: {
      type: String,
      default: "",
    },
    labelClass: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    value: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    useSlot: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>