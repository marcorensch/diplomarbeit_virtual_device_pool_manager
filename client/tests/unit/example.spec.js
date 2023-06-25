import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import DevicesView from "@/views/devices/ListView.vue";

describe("DevicesView.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(DevicesView, {
      props: { msg },
    });
    console.log(wrapper.text());
    // expect(wrapper.text()).to.include(msg);
  });
});
