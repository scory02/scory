<template>
  <n-dialog-provider>
    <n-notification-provider>
      <n-message-provider :max="1">
        <slot name="default"></slot>
      </n-message-provider>
    </n-notification-provider>
  </n-dialog-provider>
</template>
