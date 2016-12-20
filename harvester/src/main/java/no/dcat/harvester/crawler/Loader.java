package no.dcat.harvester.crawler;

import com.google.common.cache.LoadingCache;
import no.dcat.harvester.Application;
import no.dcat.harvester.crawler.CrawlerJob;
import no.dcat.harvester.crawler.handlers.ElasticSearchResultHandler;
import no.dcat.harvester.crawler.handlers.ElasticSearchResultPubHandler;
import no.difi.dcat.datastore.AdminDataStore;
import no.difi.dcat.datastore.DcatDataStore;
import no.difi.dcat.datastore.domain.DcatSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;

/**
 * Created by nodavsko on 29.09.2016.
 */

public class Loader {


    private final String DEFAULT_ELASTICSEARCH_HOST = "192.168.99.100"; //"localhost";
    private final int DEFAULT_ELASTICSEARCH_PORT = 9300;
    private final String DEFAULT_ELASTICSEARCH_CLUSTER = "elasticsearch";

    private static Logger logger = LoggerFactory.getLogger(Loader.class);

    public static void main(String[] args) {

        String file = args[0];


        Loader loader = new Loader();

        //URL url = loader.getClass().getClassLoader().getResource(file);

        //loader.loadDatasetFromFile(url.toString());
        loader.loadDatasetFromFile(file);
    }


    /**
     * Load dataset from file into elasticsearch instance on localhost
     *
     * @param filename filename to be loaded. Must be a valid DCAT file
     * @return list of strings containing validation result for DCAT file
     */
    public List<String> loadDatasetFromFile(String filename) {
        //Kompatibilitetsmetode - sikrer kompatibiltet med opprinnelig metodesignator

        return loadDatasetFromFile(filename, DEFAULT_ELASTICSEARCH_HOST, DEFAULT_ELASTICSEARCH_PORT, DEFAULT_ELASTICSEARCH_CLUSTER);
    }


    /**
     * Load dataset from file into specified elasticsearch instance
     *
     * @param filename file to be loaded into elasticsearch. Must be a valid DCAT file
     * @param elasticSearchHost hostname of elasticsearch server
     * @param elasticSearchPort port where elasticsearch cluster is reached. Usually 9300
     * @param elasticSearchCluster name of elasticsearch cluster.
     * @return list of strings containing validation result for DCAT file
     */
    public List<String> loadDatasetFromFile(String filename, String elasticSearchHost, int elasticSearchPort, String elasticSearchCluster) {
        URL url;
        try {

            logger.debug("loadDatasetFromFile: filename: " + filename);
            logger.debug("loadDatasetFromFile: elasticsearch host: " + elasticSearchHost);
            logger.debug("loadDatasetFromFile: elasticsearch port: " + elasticSearchPort);
            logger.debug("loadDatasetFromFile: elasticsearch cluster: " +elasticSearchCluster);

            url = new URL(filename);
            DcatSource dcatSource = new DcatSource("http//dcat.no/test", "Test", url.toString(), "admin_user", "123456789");


            //FusekiResultHandler fshandler = new FusekiResultHandler(dcatDataStore, null);
            CrawlerResultHandler esHandler = new ElasticSearchResultHandler(elasticSearchHost,elasticSearchPort, elasticSearchCluster);
            CrawlerResultHandler publisherHandler = new ElasticSearchResultPubHandler(elasticSearchHost,elasticSearchPort, elasticSearchCluster);

            LoadingCache<URL, String> brregCach = Application.getBrregCache();
            CrawlerJob job = new CrawlerJob(dcatSource, null, brregCach, esHandler, publisherHandler);

            job.run();

            return job.getValidationResult();

        } catch (MalformedURLException e) {
            e.printStackTrace();
        }

        return null;

    }
}
