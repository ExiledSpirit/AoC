import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;

public class main {
    public static void main(String[] args) throws Exception {
        String imagePath = "assets/image.jpg";
        BufferedImage myPicture = ImageIO.read(new File(imagePath));
        int imageHeight = myPicture.getHeight();
        int imageWidth = myPicture.getWidth();

        int[][] newImage = new int[imageWidth][imageHeight];
 
        for (int x = 0; x < imageWidth; x++) {
            for (int y = 0; y < imageHeight; y++) {
                Color pixelColor = new Color(myPicture.getRGB(x, y));
                int red = pixelColor.getRed();
                int green = pixelColor.getGreen();
                int blue = pixelColor.getBlue();
                int sum = red + green + blue;
                myPicture.setRGB(x, y, new Color(sum / 3, sum / 3, sum / 3).getRGB());
            }
        }

        File outputFile = new File("assets/new_image.png");
        ImageIO.write(myPicture, "png", outputFile);
    }
}
