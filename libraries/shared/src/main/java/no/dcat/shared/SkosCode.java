package no.dcat.shared;

import java.io.Serializable;
import java.util.Map;

/**
 * Model class codes:<type>.
 */
public class SkosCode implements Serializable{
    private String uri;
    private String code;

    private Map<String, String> prefLabel;

    public SkosCode() {
    }


    public SkosCode(String uri, String code, Map<String, String> prefLabel) {
        this.uri = uri;
        this.code = code;
        this.prefLabel = prefLabel;
    }


    public String getUri() {
        return uri;
    }

    public String getCode() { return code; }

    public void setCode(String code) { this.code = code; }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public Map<String, String> getPrefLabel() {
        return prefLabel;
    }

    public void setPrefLabel(Map<String, String> prefLabel) {
        this.prefLabel = prefLabel;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        SkosCode skosCode = (SkosCode) o;

        return getUri() != null ? getUri().equals(skosCode.getUri()) : skosCode.getUri() == null;
    }

    @Override
    public int hashCode() {
        return getUri() != null ? getUri().hashCode() : 0;
    }

    @Override
    public String toString() {
        return "SkosCode{" +
                "uri='" + uri + '\'' +
                ", code='" + code + '\'' +
                ", prefLabel=" + prefLabel +
                '}';
    }
}
