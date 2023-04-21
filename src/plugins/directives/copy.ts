/**
 * v-copy
 * 复制某个值至剪贴板
 * 接收参数：string类型/Ref<string>类型/Reactive<string>类型
	使用：在 Dom 上加上 v-copy 即可
	<div v-copy="data"></div>
 */
import type { Directive, DirectiveBinding } from "vue";
interface ElType extends HTMLElement {
  copyData: string | number;
  __handleClick__: any;
}
const copy: Directive = {
  mounted(el: ElType, binding: DirectiveBinding) {
    el.copyData = binding.value;
    el.addEventListener("click", handleClick);
  },
  updated(el: ElType, binding: DirectiveBinding) {
    el.copyData = binding.value;
  },
  beforeUnmount(el: ElType) {
    el.removeEventListener("click", el.__handleClick__);
  },
};
function handleClick(this: any) {
  /* const input = document.createElement('input');
  input.value = this.copyData.toLocaleString();
  document.body.appendChild(input);
  input.select();
  document.execCommand('Copy');
  document.body.removeChild(input); */

  if (!window["this"]["isEmpty"](this.copyData)) {
    const copyText = this.copyData.toLocaleString();
    /* 复制内容到文本域 */
    navigator.clipboard.writeText(copyText);
    window["message"].success("复制成功" + copyText);
    console.log("复制成功", copyText);
  } else {
    window["message"].error("请输入复制的内容");
  }
}

export default copy;
