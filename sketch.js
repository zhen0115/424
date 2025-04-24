let colors = ['#edafb8', '#f7e1d7', '#dedbd2', '#b0c4b1', '#4a5759'];
let shapes = [];
let numShapes;
let menuButton;
let menuButtonWidth = 120;
let menuButtonHeight = 30;
let menuButtonColor;
let menuButtonTextColor;
let isMenuOpen = false;
let menuItems = [
  { label: "自我介紹", subItems: [{ label: "蔡佳臻", url: "https://www.youtube.com/embed/0obBY0o2vSU?si=Rv7xNkjGTQOgC4YX" }], isOpen: false, subItemsHeight: 0 },
  { label: "作品集", subItems: [
    { label: "第一周", url: "https://zhen0115.github.io/0221/" },
    { label: "第三周", url: "https://zhen0115.github.io/0307/" },
    { label: "第四周", url: "https://zhen0115.github.io/0314/" },
    { label: "第六周", url: "https://zhen0115.github.io/0328/" }
  ], isOpen: false, subItemsHeight: 0 },
  { label: "測驗卷", subItems: [{ label: "數字運算與結果計算", url: "https://zhen0115.github.io/0321/" }], isOpen: false, subItemsHeight: 0 },
  { label: "教學影片", subItems: [
    { label: "第一周課程內容", url: "https://cfchen58.synology.me/%E7%A8%8B%E5%BC%8F%E8%A8%AD%E8%A8%882024/A2/week1/20250221_103847.mp4" },
    { label: "第三周課程內容", url: "https://cfchen58.synology.me/%E7%A8%8B%E5%BC%8F%E8%A8%AD%E8%A8%882024/A2/week3/20250307_111516.mp4" },
    { label: "第四周課程內容", url: "https://cfchen58.synology.me/%E7%A8%8B%E5%BC%8F%E8%A8%AD%E8%A8%882024/A2/week4/20250314_113716.mp4" },
    { label: "第六周課程內容", url: "https://cfchen58.synology.me/%E7%A8%8B%E5%BC%8F%E8%A8%AD%E8%A8%882024/A2/week6/20250328_111203.mp4" }
  ], isOpen: false, subItemsHeight: 0 }
];
let menuItemHeight = 30;
let subMenuItemHeight = 25;
let backgroundColorAlpha = 255;
let menuX;
let menuY;
let iframeContainer;

function setup() {
  createCanvas(windowWidth, windowHeight);
  numShapes = 20;
  for (let i = 0; i < numShapes; i++) {
    shapes.push(new Shape());
  }
  noStroke();

  let buttonX = width / 2 - menuButtonWidth / 2;
  let buttonY = 30;
  menuButton = {
    x: buttonX,
    y: buttonY,
    width: menuButtonWidth,
    height: menuButtonHeight,
    label: "menu"
  };
  menuButtonColor = color(200);
  menuButtonTextColor = color(0);

  menuX = width / 2 - menuButtonWidth / 2;
  menuY = menuButton.y + menuButtonHeight + 10;

  iframeContainer = createDiv('').id('iframe-container').style('position', 'fixed').style('top', '50%').style('left', '50%').style('transform', 'translate(-50%, -50%)').style('background-color', 'white').style('border', '1px solid black').style('z-index', '10').style('display', 'none');
}

function draw() {
  background(255, 229, 217, backgroundColorAlpha);
  for (let i = 0; i < shapes.length; i++) {
    shapes[i].update();
    shapes[i].display();
    shapes[i].checkHover(mouseX, mouseY);
    if (!isMenuOpen) {
      shapes[i].checkMenuCollision(menuButton);
    } else {
      let menuBottom = menuY + menuItems.length * menuItemHeight + menuItems.reduce((sum, item) => sum + item.subItemsHeight, 10);
      if (shapes[i].pos.x > menuX && shapes[i].pos.x < menuX + menuButtonWidth &&
          shapes[i].pos.y > menuY && shapes[i].pos.y < menuBottom) {
        shapes[i].alpha = 100;
      } else {
        shapes[i].alpha = 255;
      }
    }
  }

  fill(menuButtonColor);
  rect(menuButton.x, menuButton.y, menuButton.width, menuButtonHeight, 5);
  fill(menuButtonTextColor);
  textAlign(CENTER, CENTER);
  text(menuButton.label, menuButton.x + menuButtonWidth / 2, menuButton.y + menuButtonHeight / 2);

  if (isMenuOpen) {
    let currentY = menuY;
    fill(220, 220, 220, 200);
    let totalMenuHeight = menuItems.reduce((sum, item) => sum + menuItemHeight + item.subItemsHeight, 10);
    rect(menuX, menuY, menuButtonWidth, totalMenuHeight, 5);

    fill(0);
    textAlign(LEFT, CENTER);
    for (let i = 0; i < menuItems.length; i++) {
      let itemY = currentY + menuItemHeight / 2 + 5;
      text(menuItems[i].label, menuX + 10, itemY);
      if (mouseX > menuX && mouseX < menuX + menuButtonWidth &&
          mouseY > currentY && mouseY < currentY + menuItemHeight + 10) {
        fill(150);
        rect(menuX, currentY + 5, menuButtonWidth, menuItemHeight, 5);
        fill(0);
      }
      currentY += menuItemHeight + 10;

      if (menuItems[i].isOpen) {
        for (let j = 0; j < menuItems[i].subItems.length; j++) {
          let subItemY = currentY + j * subMenuItemHeight + subMenuItemHeight / 2;
          text(" - " + menuItems[i].subItems[j].label, menuX + 20, subItemY);
          if (mouseX > menuX && mouseX < menuX + menuButtonWidth &&
              mouseY > currentY + j * subMenuItemHeight && mouseY < currentY + (j + 1) * subMenuItemHeight) {
            fill(180);
            rect(menuX, currentY + j * subMenuItemHeight, menuButtonWidth, subMenuItemHeight);
            fill(0);
          }
        }
        currentY += menuItems[i].subItemsHeight;
      }
    }
  }
}

function mousePressed() {
  if (mouseX > menuButton.x && mouseX < menuButton.x + menuButtonWidth &&
      mouseY > menuButton.y && mouseY < menuButton.y + menuButtonHeight) {
    isMenuOpen = !isMenuOpen;
    backgroundColorAlpha = isMenuOpen ? 150 : 255;
    if (!isMenuOpen) {
      menuItems.forEach(item => {
        item.isOpen = false;
        item.subItemsHeight = 0;
      });
      iframeContainer.style('display', 'none');
      iframeContainer.html('');
    }
  }

  if (isMenuOpen) {
    let currentY = menuY;
    for (let i = 0; i < menuItems.length; i++) {
      if (mouseX > menuX && mouseX < menuX + menuButtonWidth &&
          mouseY > currentY && mouseY < currentY + menuItemHeight + 10) {
        menuItems[i].isOpen = !menuItems[i].isOpen;
        menuItems[i].subItemsHeight = menuItems[i].isOpen ? menuItems[i].subItems.length * subMenuItemHeight : 0;
        break;
      }
      currentY += menuItemHeight + 10 + menuItems[i].subItemsHeight;
    }

    currentY = menuY;
    for (let i = 0; i < menuItems.length; i++) {
      currentY += menuItemHeight + 10;
      if (menuItems[i].isOpen) {
        for (let j = 0; j < menuItems[i].subItems.length; j++) {
          let subItemYTop = currentY + j * subMenuItemHeight;
          let subItemYBottom = currentY + (j + 1) * subMenuItemHeight;
          if (mouseX > menuX && mouseX < menuX + menuButtonWidth &&
              mouseY > subItemYTop && mouseY < subItemYBottom) {
            let url = menuItems[i].subItems[j].url;
            iframeContainer.html(`<iframe width="800" height="600" src="${url}" frameborder="0" allowfullscreen></iframe>`);
            iframeContainer.style('display', 'block');
            break;
          }
        }
        currentY += menuItems[i].subItemsHeight;
      }
    }
  } else {
    if (iframeContainer.style('display') === 'block' &&
        (mouseX < iframeContainer.position().x || mouseX > iframeContainer.position().x + iframeContainer.width() ||
         mouseY < iframeContainer.position().y || mouseY > iframeContainer.position().y + iframeContainer.height())) {
      iframeContainer.style('display', 'none');
      iframeContainer.html('');
    }
  }
}

class Shape {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.size = random(50, 100);
    this.minSize = 30;
    this.maxSize = 120;
    this.colorIndex = floor(random(colors.length));
    this.color = color(colors[this.colorIndex]);
    this.originalColor = this.color;
    this.speedX = random(-0.5, 0.5);
    this.speedY = random(-0.5, 0.5);
    this.rotationSpeed = random(-0.01, 0.01);
    this.rotation = 0;
    this.isHovered = false;
    this.sizeChangeSpeed = 2;
    this.alpha = 255;
  }

  update() {
    this.pos.x += this.speedX;
    this.pos.y += this.speedY;
    this.rotation += this.rotationSpeed;

    if (this.pos.x + this.size / 2 > width || this.pos.x - this.size / 2 < 0) {
      this.speedX *= -1;
      this.size -= this.sizeChangeSpeed;
      if (this.size < this.minSize) {
        this.size = this.minSize;
      }
    }
    if (this.pos.y + this.size / 2 > height || this.pos.y - this.size / 2 < 0) {
      this.speedY *= -1;
      this.size += this.sizeChangeSpeed;
      if (this.size > this.maxSize) {
        this.size = this.maxSize;
      }
    }

    this.size = constrain(this.size, this.minSize, this.maxSize);
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rotation);
    fill(red(this.color), green(this.color), blue(this.color), this.alpha);
    this.drawRandomShape();
    pop();
  }

  drawRandomShape() {
    let shapeType = floor(random(3));
    if (shapeType === 0) {
      ellipse(0, 0, this.size);
    } else if (shapeType === 1) {
      rectMode(CENTER);
      rect(0, 0, this.size, this.size * random(0.5, 1.5));
    } else if (shapeType === 2) {
      triangle(
        -this.size / 2, this.size / 2,
        this.size / 2, this.size / 2,
        0, -this.size / 2
      );
    }
  }

  checkHover(mx, my) {
    let d = dist(mx, my, this.pos.x, this.pos.y);
    if (d < this.size / 2) {
      if (!this.isHovered) {
        this.color = color(random(colors));
        this.isHovered = true;
        this.speedX *= 1.1;
        this.speedY *= 1.1;
        this.rotationSpeed *= 1.2;
      }
    } else {
      if (this.isHovered) {
        this.color = this.originalColor;
        this.isHovered = false;
        this.speedX /= 1.1;
        this.speedY /= 1.1;
        this.rotationSpeed /= 1.2;
      }
    }
  }

  checkMenuCollision(button) {
    let left = this.pos.x - this.size / 2;
    let right = this.pos.x + this.size / 2;
    let top = this.pos.y - this.size / 2;
    let bottom = this.pos.y + this.size / 2;

    if (right > button.x && left < button.x + button.width &&
        bottom > button.y && top < button.y + button.height) {
      this.alpha = 100;
    } else {
      this.alpha = 255;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  let buttonX = width / 2 - menuButtonWidth / 2;
  menuButton.x = buttonX;
  menuX = buttonX;
  menuY = menuButton.y + menuButtonHeight + 10;
  iframeContainer.style('top', '50%').style('left', '50%');
}