package enrichment;

import java.io.File;
import java.nio.charset.StandardCharsets;
import org.apache.commons.io.IOUtils;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

public class Enrichment {

    public static void main(String args[]) throws Exception {
        if(args.length == 0) {
            System.err.println("command filename");
            System.exit(1);
        }

        String fileName = args[0];
        CloseableHttpClient httpclient = HttpClients.createDefault();
        try {
            HttpPost httppost = new HttpPost("http://pantherdb.org/webservices/garuda/tools/enrichment/VER_2/enrichment.jsp?");


            StringBody organism = new StringBody("Homo sapiens", ContentType.TEXT_PLAIN);
            FileBody fileData = new FileBody(new File(fileName), ContentType.TEXT_PLAIN);
            StringBody enrichmentType = new StringBody("function", ContentType.TEXT_PLAIN);       //"function", "process", "cellular_location", "protein_class", "pathway", "fullGO_function", "fullGO_process", "fullGO_component", "reactome"
            StringBody testType = new StringBody("FISHER", ContentType.TEXT_PLAIN);     // "FISHER", "BINOMIAL" .  This parameter is optional; If not specified, the system will perform Fisher’s Exact test
            StringBody type = new StringBody("enrichment", ContentType.TEXT_PLAIN);

            HttpEntity reqEntity = MultipartEntityBuilder.create()
                    .addPart("organism", organism)
                    .addPart("geneList", fileData)
                    .addPart("enrichmentType", enrichmentType)
                    .addPart("test_type", testType)
                    .addPart("type", type)
                    .build();
            httppost.setEntity(reqEntity);

            CloseableHttpResponse response = httpclient.execute(httppost);
            try {
//                System.out.println("----------------------------------------");
//                System.out.println(response.getStatusLine());
                HttpEntity resEntity = response.getEntity();
                if (resEntity != null) {
                    System.out.println(IOUtils.toString(resEntity.getContent(), StandardCharsets.UTF_8));

                }
                EntityUtils.consume(resEntity);
            } finally {
                response.close();
            }
        } finally {
            httpclient.close();
        }
    }

}
