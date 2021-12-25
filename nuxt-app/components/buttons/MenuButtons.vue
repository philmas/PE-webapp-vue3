<template>
  <div class="navWrapper">
    <div class="navHeader">Menu</div>
    <div class="navBar">
      <div class="navItem">
        <div class="navImg" style="background-image: url('./cat1.png')"></div>
        <div class="navText">Afschrijfboek</div>
      </div>
      <div class="navItem">
        <div class="navImg" style="background-image: url('./cat2.png')"></div>
        <div class="navText">Eetlijsten</div>
      </div>
      <div class="navItem">
        <div class="navImg" style="background-image: url('./cat3.png')"></div>
        <div class="navText">Media</div>
      </div>
      <div class="navItem">
        <div class="navImg" style="background-image: url('./cat4.png')"></div>
        <div class="navText">Leden</div>
      </div>
      <div class="navItem">
        <div class="navImg" style="background-image: url('./cat5.png')"></div>
        <div class="navText">Wedstrijden</div>
      </div>
      <div class="navItem">
        <div class="navImg" style="background-image: url('./cat6.png')"></div>
        <div class="navText">Agenda</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
.navWrapper {
  width: var(--width-large);
  margin: 0 auto 32px;

  .navHeader {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  .navBar {
    display: flex;
    justify-content: space-between;
    & .navItem {
      display: flex;
      align-items: center;
      flex-direction: column;
      gap: 8px 0;
      .navImg {
        background-color: white;
        background-position: center;
        background-size: 80%;
        background-repeat: no-repeat;
        // background-origin:;
        // background-clip:;
        border-radius: 24px;
        width: 96px;
        height: 128px;
      }
    }
  }
}
</style>
