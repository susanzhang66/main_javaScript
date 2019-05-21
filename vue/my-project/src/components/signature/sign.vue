<template>
  <div id="signature-pad" class="m-signature-pad"  onselectstart="return false">
    <div class="m-signature-pad--body">
      <canvas></canvas>
    </div>
    <div class="m-signature-pad--footer">
      <div class="btn-flex">
        <div class="button" v-on:click="clear">清除</div>
        <div class="button" v-on:click="back">取消</div>
        <div class="button" v-on:click="confirm">确认</div>
      </div>
    </div>
  </div>
</template>

<script>
import SignaturePad from 'signature_pad'

export default {
  name: 'signaturePad',
  props: ['cancle', 'success'],
  mounted () {
    const wrapper = document.getElementById('signature-pad')
    let canvas = wrapper.querySelector('canvas')

    const resizeCanvas = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1)
      canvas.width = canvas.offsetWidth * ratio
      canvas.height = canvas.offsetHeight * ratio
      canvas.getContext('2d').scale(ratio, ratio)
    }

    window.onresize = resizeCanvas
    resizeCanvas()

    this.signaturePad = new SignaturePad(canvas)
  },
  methods: {
    confirm () {
      if (this.signaturePad.isEmpty()) {
        this.$tip.show({message: '请先签名'})
      } else {
        this.success({
          imageData: this.signaturePad.toDataURL()
        })
      }
    },
    clear () {
      this.signaturePad.clear()
    },
    back () {
      this.cancle()
    }
  }
}
</script>

<style>
#signature-pad {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

.m-signature-pad {
  position: absolute;
  font-size: 10px;
  width: 700px;
  height: 400px;
  top: 50%;
  left: 50%;
  margin-left: -350px;
  margin-top: -200px;
  border: 1px solid #e8e8e8;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.27), 0 0 40px rgba(0, 0, 0, 0.08) inset;
  border-radius: 4px;
}

.m-signature-pad:before, .m-signature-pad:after {
  position: absolute;
  z-index: -1;
  content: "";
  width: 40%;
  height: 10px;
  left: 20px;
  bottom: 10px;
  background: transparent;
  -webkit-transform: skew(-3deg) rotate(-3deg);
  -moz-transform: skew(-3deg) rotate(-3deg);
  -ms-transform: skew(-3deg) rotate(-3deg);
  -o-transform: skew(-3deg) rotate(-3deg);
  transform: skew(-3deg) rotate(-3deg);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.4);
}

.m-signature-pad:after {
  left: auto;
  right: 20px;
  -webkit-transform: skew(3deg) rotate(3deg);
  -moz-transform: skew(3deg) rotate(3deg);
  -ms-transform: skew(3deg) rotate(3deg);
  -o-transform: skew(3deg) rotate(3deg);
  transform: skew(3deg) rotate(3deg);
}

.m-signature-pad--body {
  position: absolute;
  left: 20px;
  right: 20px;
  top: 20px;
  bottom: 60px;
  border: 1px solid #f4f4f4;
}

.m-signature-pad--body
  canvas {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.02) inset;
  }

.m-signature-pad--footer {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 20px;
  height: 40px;
}

.m-signature-pad--footer
  .button {
    text-align: center;
    padding-top: 20px;
  }

@media screen and (max-width: 1024px) {
  .m-signature-pad {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: auto;
    height: auto;
    min-width: 250px;
    min-height: 140px;
    margin: 5%;
  }
}

@media screen and (min-device-width: 768px) and (max-device-width: 1024px) {
  .m-signature-pad {
    margin: 10%;
  }
}

@media screen and (max-height: 320px) {
  .m-signature-pad--body {
    left: 0;
    right: 0;
    top: 0;
    bottom: 32px;
  }
  .m-signature-pad--footer {
    left: 20px;
    right: 20px;
    bottom: 4px;
    height: 28px;
  }
  .m-signature-pad--footer
    .description {
      font-size: 1em;
      margin-top: 1em;
    }
}
</style>
