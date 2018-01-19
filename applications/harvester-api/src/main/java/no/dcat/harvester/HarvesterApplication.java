package no.dcat.harvester;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.io.InputStream;
import java.net.URL;

@SpringBootApplication
@PropertySource({"classpath:swagger.properties"})
@EnableSwagger2
public class HarvesterApplication {
    static Logger logger = LoggerFactory.getLogger(HarvesterApplication.class);

	@Value("${springfox.documentation.swagger.v2.path}")
	private String swagger2Endpoint;


    @Bean
    public static LoadingCache<URL, String> getBrregCache() {
        logger.debug("Starting BRREG cache 2!");

		LoadingCache<URL, String> brregCache = CacheBuilder.newBuilder().maximumSize(1000)
				.build(new CacheLoader<URL, String>() {
					public String load(URL url) throws Exception {
						try (InputStream inputStream = url.openStream()) {
							return IOUtils.toString(inputStream);
						}
					}
				});

		return brregCache;
    }

	@Bean
	public Docket api() {
		return new Docket(DocumentationType.SWAGGER_2)
				.select()
				.apis(RequestHandlerSelectors.any())
				.paths(PathSelectors.any())
				.build();
	}

    public static void main(String[] args) {


        SpringApplication.run(HarvesterApplication.class, args);


    }

}
